import { Outlet, Link } from "react-router-dom";
import {
  Box,
  Drawer,
  List,
  ListItem,
  ListItemButton,
  ListItemText,
  Toolbar,
  Typography
} from "@mui/material";

const drawerWidth = 240;

export default function Layout() {
  return (
    <Box sx={{ display: "flex" }}>
      <Drawer
        variant="permanent"
        sx={{
          width: drawerWidth,
          flexShrink: 0,
          "& .MuiDrawer-paper": {
            width: drawerWidth,
            boxSizing: "border-box",
            backgroundColor: "#1e293b",
            color: "white"
          },
        }}
      >
        <Toolbar>
          <Typography variant="h6" sx={{ fontWeight: "bold" }}>
            WMS
          </Typography>
        </Toolbar>

        <List>
          {[
            { text: "Dashboard", path: "/dashboard" },
            { text: "Produtos", path: "/produtos" },
            { text: "Pedidos", path: "/pedidos" },
            { text: "Movimentações", path: "/movimentacoes" },
            { text: "Usuários", path: "/usuarios" },
            { text: "Localizações", path: "/localizacoes" },
          ].map((item) => (
            <ListItem key={item.text} disablePadding>
              <ListItemButton
                component={Link}
                to={item.path}
                sx={{
                  "&:hover": {
                    backgroundColor: "#334155",
                  },
                }}
              >
                <ListItemText primary={item.text} />
              </ListItemButton>
            </ListItem>
          ))}
        </List>
      </Drawer>

      <Box
        component="main"
        sx={{
          flexGrow: 1,
          p: 4,
          backgroundColor: "#f1f5f9",
          minHeight: "100vh"
        }}
      >
        <Outlet />
      </Box>
    </Box>
  );
}