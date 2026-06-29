-- Schedules the Supabase Edge Function that refreshes live price snapshots.
--
-- Before applying this migration in Supabase, enable Vault and store these
-- secrets:
--
--   create extension if not exists supabase_vault with schema vault;
--
--   select vault.create_secret(
--     'https://<project-ref>.supabase.co/functions/v1/refresh-live-prices',
--     'live_price_refresh_url'
--   );
--
--   select vault.create_secret(
--     '<supabase-service-role-key>',
--     'live_price_refresh_service_role_key'
--   );
--
-- The broad UTC cron window covers the US regular market session in both EDT
-- and EST. The Edge Function performs the exact NYSE trading-day and
-- 9:30am-4:00pm ET guard.

create extension if not exists pg_cron with schema extensions;
create extension if not exists pg_net with schema extensions;
create extension if not exists supabase_vault with schema vault;

do $$
begin
    if exists (
        select 1
        from cron.job
        where jobname = 'live-price-refresh-every-minute'
    ) then
        perform cron.unschedule('live-price-refresh-every-minute');
    end if;
end;
$$;

select cron.schedule(
    'live-price-refresh-every-minute',
    '* 13-21 * * 1-5',
    $$
    select net.http_post(
        url := (
            select decrypted_secret
            from vault.decrypted_secrets
            where name = 'live_price_refresh_url'
            limit 1
        ),
        headers := jsonb_build_object(
            'Content-Type',
            'application/json',
            'Authorization',
            'Bearer ' || (
                select decrypted_secret
                from vault.decrypted_secrets
                where name = 'live_price_refresh_service_role_key'
                limit 1
            )
        ),
        body := jsonb_build_object(
            'source',
            'supabase_cron',
            'regularHoursOnly',
            true
        ),
        timeout_milliseconds := 25000
    ) as request_id;
    $$
);
