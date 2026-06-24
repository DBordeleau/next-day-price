create or replace function public.refresh_dashboard_latest_user_predictions()
returns void
language plpgsql
security definer
set search_path = public
as $$
begin
    delete from public.dashboard_latest_user_predictions;

    insert into public.dashboard_latest_user_predictions (
        generated_at,
        prediction_id,
        user_id,
        username,
        avatar_style,
        avatar_seed,
        avatar_options,
        prediction_date,
        target_date,
        prediction_horizon,
        ticker,
        reference_close,
        predicted_return,
        predicted_close
    )
    select
        now(),
        prediction.prediction_id,
        prediction.user_id,
        coalesce(profile.display_username, profile.username::text, prediction.user_id::text),
        coalesce(profile.avatar_style, 'adventurer-neutral'),
        coalesce(profile.avatar_seed, prediction.user_id::text),
        coalesce(profile.avatar_options, '{}'::jsonb),
        prediction.prediction_date,
        prediction.target_date,
        prediction.prediction_horizon,
        prediction.ticker,
        prediction.reference_close,
        prediction.predicted_return,
        prediction.predicted_close
    from public.user_predictions prediction
    join public.user_profiles profile
        on profile.user_id = prediction.user_id
    where profile.is_public = true
        and prediction.status <> 'cancelled'
        and prediction.prediction_date = (
            select max(latest_prediction.prediction_date)
            from public.user_predictions latest_prediction
            join public.user_profiles latest_profile
                on latest_profile.user_id = latest_prediction.user_id
            where latest_profile.is_public = true
                and latest_prediction.status <> 'cancelled'
        )
    order by prediction.ticker, lower(coalesce(profile.display_username, profile.username::text));
end;
$$;

create or replace function public.refresh_dashboard_latest_user_predictions_trigger()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
    perform public.refresh_dashboard_latest_user_predictions();
    return null;
end;
$$;

drop trigger if exists refresh_latest_user_predictions_on_prediction_change
on public.user_predictions;

create trigger refresh_latest_user_predictions_on_prediction_change
after insert or update or delete on public.user_predictions
for each statement
execute function public.refresh_dashboard_latest_user_predictions_trigger();

drop trigger if exists refresh_latest_user_predictions_on_profile_change
on public.user_profiles;

create trigger refresh_latest_user_predictions_on_profile_change
after insert or update of display_username, username, is_public, avatar_style, avatar_seed, avatar_options or delete
on public.user_profiles
for each statement
execute function public.refresh_dashboard_latest_user_predictions_trigger();

create or replace function public.remove_private_user_dashboard_rows()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
    if new.is_public = false and old.is_public is distinct from new.is_public then
        delete from public.dashboard_user_leaderboard
        where user_id = new.user_id;

        delete from public.dashboard_user_ticker_leaderboard
        where user_id = new.user_id;

        perform public.refresh_dashboard_latest_user_predictions();
    end if;

    return new;
end;
$$;

select public.refresh_dashboard_latest_user_predictions();
