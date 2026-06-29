import { useState, useEffect } from "react";
import {
  Typography, Paper, Table, TableHead, TableRow, TableCell,
  TableBody, Button, IconButton, Dialog, DialogTitle,
  DialogContent, DialogActions, TextField, Stack
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";

export default function Produtos() {
  const [listaProdutos, setListaProdutos] = useState([]);
  const [open, setOpen] = useState(false); 
  

  const [produtoAtual, setProdutoAtual] = useState({ name: "", price: "", stock: "" });
  const [editandoId, setEditandoId] = useState(null);


  const carregarProdutos = () => {
    fetch("http://localhost:3000/products")
      .then((res) => res.json())
      .then((dados) => setListaProdutos(dados))
      .catch((err) => console.error("Erro ao carregar:", err));
  };

  useEffect(() => {
    carregarProdutos();
  }, []);

  // 2. ABRIR JANELA (Para Novo ou Editar)
  const handleOpen = (produto = null) => {
    if (produto) {
      setProdutoAtual({ name: produto.name, price: produto.price, stock: produto.stock });
      setEditandoId(produto.id);
    } else {
      setProdutoAtual({ name: "", price: "", stock: "" });
      setEditandoId(null);
    }
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    setProdutoAtual({ name: "", price: "", stock: "" });
  };


  const handleSave = () => {
    const metodo = editandoId ? "PUT" : "POST";
    const url = editandoId 
      ? `http://localhost:3000/products/${editandoId}` 
      : "http://localhost:3000/products";

    fetch(url, {
      method: metodo,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name: produtoAtual.name,
        price: Number(produtoAtual.price),
        stock: Number(produtoAtual.stock)
      }),
    })
    .then(() => {
      carregarProdutos();
      handleClose();
    })
    .catch((err) => console.error("Erro ao salvar:", err));
  };

 
  const handleExcluir = (id) => {
    if (window.confirm("Deseja realmente excluir este produto?")) {
      fetch(`http://localhost:3000/products/${id}`, { method: "DELETE" })
        .then(() => carregarProdutos())
        .catch((err) => console.error("Erro ao excluir:", err));
    }
  };

  return (
    <>
      <Typography variant="h4" sx={{ mb: 3 }}>Produtos</Typography>

      <Paper sx={{ p: 3, borderRadius: 3 }}>
        <Button variant="contained" sx={{ mb: 2 }} onClick={() => handleOpen()}>
          Novo Produto
        </Button>

        <Table>
          <TableHead>
            <TableRow>
              <TableCell>ID</TableCell>
              <TableCell>Nome</TableCell>
              <TableCell>Preço</TableCell>
              <TableCell>Estoque</TableCell>
              <TableCell align="right">Ações</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {listaProdutos.map((p) => (
              <TableRow key={p.id}>
                <TableCell>{p.id}</TableCell>
                <TableCell>{p.name}</TableCell>
                <TableCell>R$ {p.price.toFixed(2)}</TableCell>
                <TableCell>{p.stock}</TableCell>
                <TableCell align="right">
                  <IconButton color="primary" onClick={() => handleOpen(p)}>
                    <EditIcon />
                  </IconButton>
                  <IconButton color="error" onClick={() => handleExcluir(p.id)}>
                    <DeleteIcon />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Paper>

    
      <Dialog open={open} onClose={handleClose} fullWidth maxWidth="sm">
        <DialogTitle>{editandoId ? "Editar Produto" : "Novo Produto"}</DialogTitle>
        <DialogContent>
          <Stack spacing={2} sx={{ mt: 1 }}>
            <TextField
              label="Nome do Produto"
              fullWidth
              value={produtoAtual.name}
              onChange={(e) => setProdutoAtual({ ...produtoAtual, name: e.target.value })}
            />
            <TextField
              label="Preço"
              type="number"
              fullWidth
              value={produtoAtual.price}
              onChange={(e) => setProdutoAtual({ ...produtoAtual, price: e.target.value })}
            />
            <TextField
              label="Quantidade em Estoque"
              type="number"
              fullWidth
              value={produtoAtual.stock}
              onChange={(e) => setProdutoAtual({ ...produtoAtual, stock: e.target.value })}
            />
          </Stack>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Cancelar</Button>
          <Button variant="contained" onClick={handleSave}>Salvar</Button>
        </DialogActions>
      </Dialog>
    </>
  );
}