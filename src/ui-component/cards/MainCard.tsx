import PropTypes from "prop-types";
import { forwardRef, type ReactNode } from "react";

// material-ui
import { useTheme } from "@mui/material/styles";
import { Card, CardContent, CardHeader, Divider, Typography, type SxProps, type Theme } from "@mui/material";

// constant
const headerSX = {
  "& .MuiCardHeader-action": { mr: 0 }
};

// Define the prop types with TypeScript interface
interface MainCardProps {
  border?: boolean;
  boxShadow?: boolean;
  children?: ReactNode;
  content?: boolean;
  contentClass?: string;
  contentSX?: SxProps<Theme>;
  darkTitle?: boolean;
  secondary?: ReactNode;
  shadow?: string;
  sx?: SxProps<Theme>;
  title?: ReactNode;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  [key: string]: any; // For any other props
}

// ==============================|| CUSTOM MAIN CARD ||============================== //

const MainCard = forwardRef<HTMLDivElement, MainCardProps>(
  (
    {
      border = true,
      boxShadow,
      children,
      content = true,
      contentClass = "",
      contentSX = {},
      darkTitle,
      secondary,
      shadow,
      sx = {},
      title,
      ...others
    },
    ref
  ) => {
    const theme = useTheme();

    return (
      <Card
        ref={ref}
        {...others}
        sx={{
          background: "#fff",
          border: border ? "1px solid" : "none",
          borderColor: theme.palette.primary[200] + 25,
          ":hover": {
            boxShadow: boxShadow ? shadow || "0 2px 14px 0 rgb(32 40 45 / 8%)" : "inherit"
          },
          ...sx
        }}
      >
        {/* card header and action */}
        {title && <CardHeader sx={headerSX} title={darkTitle ? <Typography variant="h3">{title}</Typography> : title} action={secondary} />}

        {/* content & header divider */}
        {title && <Divider />}

        {/* card content */}
        {content && (
          <CardContent sx={contentSX} className={contentClass}>
            {children}
          </CardContent>
        )}
        {!content && children}
      </Card>
    );
  }
);

// PropTypes for runtime type checking
MainCard.propTypes = {
  border: PropTypes.bool,
  boxShadow: PropTypes.bool,
  children: PropTypes.node,
  content: PropTypes.bool,
  contentClass: PropTypes.string,
  contentSX: PropTypes.object,
  darkTitle: PropTypes.bool,
  secondary: PropTypes.oneOfType([PropTypes.node, PropTypes.string, PropTypes.object]),
  shadow: PropTypes.string,
  sx: PropTypes.object,
  title: PropTypes.oneOfType([PropTypes.node, PropTypes.string, PropTypes.object])
};

// Add display name for debugging
MainCard.displayName = 'MainCard';

export default MainCard;