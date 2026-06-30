import { useState, useEffect } from "react";
import { Box, Grid, Paper, Typography, List, ListItem, ListItemText, Divider } from "@mui/material";

export default function Dashboard() {
  const [totalProdutos, setTotalProdutos] = useState(0);
  const [pedidosPendentes, setPedidosPendentes] = useState([]);
  
  const [totalUsuarios, setTotalUsuarios] = useState(2);

  // busca os dados reais do Backend assim que a Dashboard abre
  useEffect(() => {
    // busca total de Produtos
    fetch("http://localhost:3000/products")
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data)) {
          setTotalProdutos(data.length); // conta quantos produtos tem no array
        }
      })
      .catch((err) => console.error("Erro ao buscar produtos:", err));

    // busca Pedidos e filtra os Pendentes
    fetch("http://localhost:3000/orders")
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data)) {
          // filtra o array para pegar apenas os que têm status "Pendente"
          const pendentes = data.filter((pedido) => pedido.status === "Pendente");
          setPedidosPendentes(pendentes);
        }
      })
      .catch((err) => console.error("Erro ao buscar pedidos:", err));
  }, []);

  return (
    <Box sx={{ p: 4 }}>
      <Typography variant="h4" sx={{ mb: 3, fontWeight: 'bold' }}>Dashboard</Typography>

      {/* cards de resumo */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} sm={4}>
          <Paper elevation={3} sx={{ p: 3, textAlign: 'center', borderRadius: 2 }}>
            <Typography variant="h6" color="textSecondary">Produtos</Typography>
            <Typography variant="h3" sx={{ fontWeight: 'bold', mt: 1 }}>
              {totalProdutos}
            </Typography>
          </Paper>
        </Grid>
        
        <Grid item xs={12} sm={4}>
          <Paper elevation={3} sx={{ p: 3, textAlign: 'center', borderRadius: 2 }}>
            <Typography variant="h6" color="textSecondary">Pedidos Pendentes</Typography>
            <Typography variant="h3" color="warning.main" sx={{ fontWeight: 'bold', mt: 1 }}>
              {pedidosPendentes.length}
            </Typography>
          </Paper>
        </Grid>

        <Grid item xs={12} sm={4}>
          <Paper elevation={3} sx={{ p: 3, textAlign: 'center', borderRadius: 2 }}>
            <Typography variant="h6" color="textSecondary">Usuários</Typography>
            <Typography variant="h3" sx={{ fontWeight: 'bold', mt: 1 }}>
              {totalUsuarios}
            </Typography>
          </Paper>
        </Grid>
      </Grid>

      {/* lista de pedidos pendentes */}
      <Paper elevation={3} sx={{ p: 3, borderRadius: 2 }}>
        <Typography variant="h6" sx={{ mb: 2 }}>Lista de Pedidos Pendentes</Typography>
        <Divider sx={{ mb: 2 }} />
        
        {pedidosPendentes.length === 0 ? (
          <Typography color="textSecondary">Nenhum pedido pendente no momento. 🎉</Typography>
        ) : (
          <List>
            {pedidosPendentes.map((pedido) => (
              <ListItem key={pedido.id} disablePadding sx={{ mb: 1 }}>
                <ListItemText 
                  primary={`Pedido #${pedido.id} - ${pedido.customerName}`} 
                  secondary={`Produto: ${pedido.product?.name} | Quantidade: ${pedido.quantity}`}
                />
              </ListItem>
            ))}
          </List>
        )}
      </Paper>
    </Box>
  );
}