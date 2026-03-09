import {
  Card,
  CardContent,
  Typography,
  Grid,
  Paper,
} from "@mui/material";
import { produtos, pedidos, usuarios } from "../data/mockData";

export default function Dashboard() {
  const pedidosPendentes = pedidos.filter(
    (p) => p.status === "Pendente"
  );

  const cards = [
    { titulo: "Produtos", valor: produtos.length },
    { titulo: "Pedidos Pendentes", valor: pedidosPendentes.length },
    { titulo: "Usuários", valor: usuarios.length },
  ];

  return (
    <>
      <Typography variant="h4" sx={{ mb: 3, fontWeight: "bold" }}>
        Dashboard
      </Typography>

      <Grid container spacing={3}>
        {cards.map((card) => (
          <Grid item xs={12} md={4} key={card.titulo}>
            <Card
              sx={{
                borderRadius: 3,
                boxShadow: 3,
              }}
            >
              <CardContent>
                <Typography variant="subtitle1" color="text.secondary">
                  {card.titulo}
                </Typography>
                <Typography variant="h3" sx={{ fontWeight: "bold" }}>
                  {card.valor}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      <Paper sx={{ mt: 4, p: 3, borderRadius: 3 }}>
        <Typography variant="h6" sx={{ mb: 2 }}>
          Pedidos Pendentes
        </Typography>

        {pedidosPendentes.map((pedido) => (
          <Typography key={pedido.id}>
            Pedido #{pedido.id} - {pedido.cliente}
          </Typography>
        ))}
      </Paper>
    </>
  );
}