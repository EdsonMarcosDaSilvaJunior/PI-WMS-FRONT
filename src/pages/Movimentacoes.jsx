import { useState, useEffect } from "react";
import {
  Typography, Paper, Button, TextField, Select, MenuItem,
  InputLabel, FormControl, Stack, Table, TableHead,
  TableRow, TableCell, TableBody, Alert, Box
} from "@mui/material";

export default function Movimentacoes() {
  const [produtos, setProdutos] = useState([]);
  
  // estados do formulário
  const [productId, setProductId] = useState("");
  const [type, setType] = useState("entrada");
  const [quantity, setQuantity] = useState("");
  
  // estado para mostrar mensagens de sucesso ou   erro
  const [mensagem, setMensagem] = useState({ texto: "", tipo: "" });

  // busca os produtos para preencher a caixa de seleção e a tabela
  const carregarProdutos = () => {
    fetch("http://localhost:3000/products")
      .then((res) => res.json())
      .then((dados) => setProdutos(dados))
      .catch((err) => console.error("Erro ao carregar produtos:", err));
  };

  useEffect(() => {
    carregarProdutos();
  }, []);

  // envia a movimentação para o backend
  const handleSalvar = () => {
    // Validação básica
    if (!productId || !quantity || quantity <= 0) {
      setMensagem({ texto: "Preencha todos os campos com valores válidos.", tipo: "error" });
      return;
    }

    const payload = {
      productId: Number(productId),
      type: type,
      quantity: Number(quantity)
    };

    fetch("http://localhost:3000/movements", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload)
    })
      .then(async (res) => {
        // se o backend jogar um erro (ex: sstoque insuficiente), é capturado aqui
        if (!res.ok) {
          const erro = await res.json();
          throw new Error(erro.error || "Erro ao registrar movimentação");
        }
        return res.json();
      })
      .then(() => {
        setMensagem({ texto: "Movimentação registrada com sucesso!", tipo: "success" });
        setQuantity(""); 
        carregarProdutos(); 
      })
      .catch((err) => {
        setMensagem({ texto: err.message, tipo: "error" });
      });
  };

  return (
    <>
      <Typography variant="h4" sx={{ mb: 3 }}>Movimentações de Estoque</Typography>

   
      <Paper sx={{ p: 3, borderRadius: 3, mb: 4 }}>
        <Typography variant="h6" sx={{ mb: 2 }}>Registrar Nova Movimentação</Typography>
        
        {mensagem.texto && (
          <Alert severity={mensagem.tipo} sx={{ mb: 2 }}>
            {mensagem.texto}
          </Alert>
        )}

        <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2} alignItems="center">
          
          <FormControl fullWidth>
            <InputLabel>Produto</InputLabel>
            <Select
              value={productId}
              label="Produto"
              onChange={(e) => setProductId(e.target.value)}
            >
              {produtos.map((p) => (
                <MenuItem key={p.id} value={p.id}>
                  {p.name} (Estoque atual: {p.stock})
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          <FormControl fullWidth>
            <InputLabel>Tipo</InputLabel>
            <Select
              value={type}
              label="Tipo"
              onChange={(e) => setType(e.target.value)}
            >
              <MenuItem value="entrada">Entrada (+)</MenuItem>
              <MenuItem value="saida">Saída (-)</MenuItem>
            </Select>
          </FormControl>

          <TextField
            label="Quantidade"
            type="number"
            fullWidth
            value={quantity}
            onChange={(e) => setQuantity(e.target.value)}
          />

          <Button 
            variant="contained" 
            size="large" 
            onClick={handleSalvar}
            sx={{ minWidth: '150px', height: '56px' }}
          >
            Registrar
          </Button>

        </Stack>
      </Paper>

      
      <Paper sx={{ p: 3, borderRadius: 3 }}>
        <Typography variant="h6" sx={{ mb: 2 }}>Visão Geral do Estoque</Typography>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>ID do Produto</TableCell>
              <TableCell>Nome</TableCell>
              <TableCell>Estoque Disponível</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {produtos.map((p) => (
              <TableRow key={p.id}>
                <TableCell>{p.id}</TableCell>
                <TableCell>{p.name}</TableCell>
                <TableCell sx={{ 
                  fontWeight: 'bold', 
                  color: p.stock === 0 ? 'error.main' : 'success.main' 
                }}>
                  {p.stock}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Paper>
    </>
  );
}