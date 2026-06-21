import { createTheme, rem } from "@mantine/core";

export const theme = createTheme({
  primaryColor: "green",
  fontFamily:
    "Inter, ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, Segoe UI, sans-serif",
  headings: {
    fontFamily:
      "Inter, ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, Segoe UI, sans-serif",
    fontWeight: "760",
  },
  defaultRadius: "sm",
  colors: {
    green: [
      "#edfdf3",
      "#d7f7e2",
      "#a9efc1",
      "#78e69d",
      "#4dde7e",
      "#22c55e",
      "#16a34a",
      "#15803d",
      "#166534",
      "#14532d",
    ],
  },
  components: {
    Button: {
      defaultProps: {
        size: "sm",
      },
    },
    Card: {
      defaultProps: {
        radius: "sm",
        withBorder: true,
      },
    },
    SegmentedControl: {
      defaultProps: {
        radius: "sm",
      },
    },
    Tooltip: {
      defaultProps: {
        withArrow: true,
        transitionProps: { duration: 120 },
      },
    },
    Title: {
      styles: {
        root: {
          letterSpacing: 0,
        },
      },
    },
    Text: {
      styles: {
        root: {
          letterSpacing: 0,
        },
      },
    },
    Table: {
      styles: {
        table: {
          fontVariantNumeric: "tabular-nums",
        },
        th: {
          fontSize: rem(11),
          textTransform: "uppercase",
          letterSpacing: 0,
        },
      },
    },
  },
});
