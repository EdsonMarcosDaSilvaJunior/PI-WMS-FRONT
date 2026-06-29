import React, { useState, useEffect } from "react";
import { 
  Box, Paper, Typography, Table, TableBody, TableCell, 
  TableContainer, TableHead, TableRow, Button, Alert, Chip,
  Dialog, DialogTitle, DialogContent, DialogActions, TextField, 
  Select, MenuItem, FormControl, InputLabel
} from "@mui/material";

export default function Pedidos() {
  const [orders, setOrders] = useState([]);
  const [produtos, setProdutos] = useState([]); // Guarda os produtos para o select
  const [mensagem, setMensagem] = useState({ texto: "", tipo: "" });

  // ESTADOS DOS MODAIS
  const [isCriarModalOpen, setIsCriarModalOpen] = useState(false);
  const [isConfirmarModalOpen, setIsConfirmarModalOpen] = useState(false);
  const [pedidoSelecionado, setPedidoSelecionado] = useState(null);
  const [novoPedido, setNovoPedido] = useState({ customerName: "", quantity: 1, productId: "" });

  // 1. BUSCAR PEDIDOS DO BANCO
  const fetchOrders = async () => {
    try {
      const response = await fetch("http://localhost:3000/orders");
      const data = await response.json();
      if (Array.isArray(data)) setOrders(data);
    } catch (error) {
      console.error("Erro ao buscar pedidos:", error);
    }
  };

  // 2. BUSCAR PRODUTOS DO BANCO (Para usar na criação do pedido)
  const fetchProdutos = async () => {
    try {
      // Confirme se a sua rota de buscar produtos é essa mesma
      const response = await fetch("http://localhost:3000/products"); 
      const data = await response.json();
      if (Array.isArray(data)) setProdutos(data);
    } catch (error) {
      console.error("Erro ao buscar produtos:", error);
    }
  };

  // Carrega pedidos e produtos quando a tela abre
  useEffect(() => {
    fetchOrders();
    fetchProdutos();
  }, []);

  // --------------------------------------------------------
  // LÓGICA DO MODAL DE CRIAR PEDIDO
  // --------------------------------------------------------
  const handleCriarPedido = async () => {
    try {
      const response = await fetch("http://localhost:3000/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(novoPedido)
      });
      
      if (response.ok) {
        setMensagem({ texto: "Pedido criado com sucesso!", tipo: "success" });
        setIsCriarModalOpen(false);
        setNovoPedido({ customerName: "", quantity: 1, productId: "" }); // Limpa o form
        fetchOrders(); // Atualiza a tabela
      } else {
        const data = await response.json();
        setMensagem({ texto: data.error || "Erro ao criar pedido.", tipo: "error" });
      }
    } catch (error) {
      setMensagem({ texto: "Erro de conexão ao criar pedido.", tipo: "error" });
    }
  };

  // --------------------------------------------------------
  // LÓGICA DO MODAL DE SEPARAÇÃO
  // --------------------------------------------------------
  const abrirModalSeparacao = (order) => {
    setPedidoSelecionado(order);
    setIsConfirmarModalOpen(true);
  };

  const confirmarSeparacao = async () => {
    if (!pedidoSelecionado) return;

    try {
      const response = await fetch(`http://localhost:3000/orders/${pedidoSelecionado.id}/separar`, {
        method: "PATCH"
      });
      const data = await response.json();

      if (response.ok) {
        setMensagem({ texto: "Pedido separado com sucesso!", tipo: "success" });
        fetchOrders(); // Recarrega a tabela
      } else {
        setMensagem({ texto: data.error, tipo: "error" });
      }
    } catch (error) {
      setMensagem({ texto: "Erro de conexão ao separar o pedido.", tipo: "error" });
    } finally {
      setIsConfirmarModalOpen(false); // Fecha o modal sempre no final
      setPedidoSelecionado(null);
    }
  };

  return (
    <Box sx={{ p: 4 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h4">Fila de Pedidos</Typography>
        <Button 
          variant="contained" 
          color="success" 
          onClick={() => setIsCriarModalOpen(true)}
        >
          + Novo Pedido
        </Button>
      </Box>

      {mensagem.texto && <Alert severity={mensagem.tipo} sx={{ mb: 3 }}>{mensagem.texto}</Alert>}

      <TableContainer component={Paper} elevation={3}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell><strong>ID</strong></TableCell>
              <TableCell><strong>Cliente</strong></TableCell>
              <TableCell><strong>Produto</strong></TableCell>
              <TableCell><strong>Qtd</strong></TableCell>
              <TableCell><strong>Status</strong></TableCell>
              <TableCell><strong>Ação</strong></TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {orders.map((order) => (
              <TableRow key={order.id}>
                <TableCell>{order.id}</TableCell>
                <TableCell>{order.customerName}</TableCell>
                <TableCell>{order.product?.name}</TableCell>
                <TableCell>{order.quantity}</TableCell>
                <TableCell>
                  <Chip 
                    label={order.status} 
                    color={order.status === "Separado" ? "success" : "warning"} 
                    variant="filled"
                    size="small"
                  />
                </TableCell>
                <TableCell>
                  <Button 
                    variant="contained" 
                    color="primary" 
                    disabled={order.status === "Separado"} 
                    // Mudamos aqui para abrir o modal em vez de disparar direto
                    onClick={() => abrirModalSeparacao(order)}
                  >
                    {order.status === "Separado" ? "CONCLUÍDO" : "SEPARAR"}
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      {/* ============================================================== */}
      {/* DIALOG (MODAL) - CRIAR NOVO PEDIDO                             */}
      {/* ============================================================== */}
      <Dialog open={isCriarModalOpen} onClose={() => setIsCriarModalOpen(false)} fullWidth maxWidth="sm">
        <DialogTitle>Criar Novo Pedido</DialogTitle>
        <DialogContent sx={{ display: 'flex', flexDirection: 'column', gap: 2, pt: 2 }}>
          <TextField 
            label="Nome do Cliente" 
            fullWidth 
            value={novoPedido.customerName}
            onChange={(e) => setNovoPedido({ ...novoPedido, customerName: e.target.value })}
            sx={{ mt: 1 }}
          />
          <TextField 
            label="Quantidade" 
            type="number" 
            fullWidth 
            value={novoPedido.quantity}
            onChange={(e) => setNovoPedido({ ...novoPedido, quantity: e.target.value })}
          />
          <FormControl fullWidth>
            <InputLabel id="produto-select-label">Produto</InputLabel>
            <Select
              labelId="produto-select-label"
              label="Produto"
              value={novoPedido.productId}
              onChange={(e) => setNovoPedido({ ...novoPedido, productId: e.target.value })}
            >
              {produtos.map((prod) => (
                <MenuItem key={prod.id} value={prod.id}>{prod.name}</MenuItem>
              ))}
            </Select>
          </FormControl>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setIsCriarModalOpen(false)} color="inherit">Cancelar</Button>
          <Button onClick={handleCriarPedido} variant="contained" color="success">Salvar Pedido</Button>
        </DialogActions>
      </Dialog>

      {/* ============================================================== */}
      {/* DIALOG (MODAL) - CONFIRMAR SEPARAÇÃO                           */}
      {/* ============================================================== */}
      <Dialog open={isConfirmarModalOpen} onClose={() => setIsConfirmarModalOpen(false)}>
        <DialogTitle>Confirmar Separação</DialogTitle>
        <DialogContent>
          <Typography>
            Deseja confirmar a separação do pedido <strong>nº {pedidoSelecionado?.id}</strong> (Cliente: {pedidoSelecionado?.customerName})?
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setIsConfirmarModalOpen(false)} color="inherit">
            Cancelar
          </Button>
          <Button onClick={confirmarSeparacao} variant="contained" color="primary">
            Confirmar
          </Button>
        </DialogActions>
      </Dialog>

    </Box>
  );
}