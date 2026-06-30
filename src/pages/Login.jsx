import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Box, Paper, Typography, TextField, Button, Link, Alert, Stack } from "@mui/material";

export default function Login() {
  const navigate = useNavigate();
  
  // 'login', 'register', 'forgot' ou 'reset_password'
  const [view, setView] = useState("login"); 
  
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [newPassword, setNewPassword] = useState(""); 
  const [code, setCode] = useState(""); // Estado para o código de verificação
  const [mensagem, setMensagem] = useState({ texto: "", tipo: "" });

  const mudarTela = (novaTela) => {
    setView(novaTela);
    setMensagem({ texto: "", tipo: "" });
    if (novaTela !== "reset_password") {
      setEmail("");
    }
    setPassword("");
    setNewPassword("");
    setName("");
    setCode("");
  };

  // ação de Login
  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch("http://localhost:3000/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password })
      });
      const dados = await response.json();

      if (response.ok) {
        navigate("/dashboard"); 
      } else {
        setMensagem({ texto: dados.error, tipo: "error" });
      }
    } catch (error) {
      setMensagem({ texto: "Erro ao conectar com o servidor.", tipo: "error" });
    }
  };

  // ação de Cadastro
  const handleRegister = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch("http://localhost:3000/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, password })
      });
      const dados = await response.json();

      if (response.ok) {
        setMensagem({ texto: "Conta criada com sucesso! Faça seu login.", tipo: "success" });
        setView("login");
        setEmail("");
        setPassword("");
      } else {
        setMensagem({ texto: dados.error, tipo: "error" });
      }
    } catch (error) {
      setMensagem({ texto: "Erro ao conectar com o servidor.", tipo: "error" });
    }
  };

  // ação de esqueci a senha 
  const handleForgot = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch("http://localhost:3000/auth/forgot-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email })
      });
      const dados = await response.json();

      if (response.ok) {
        // exibe a mensagem vinda do backend
        setMensagem({ texto: dados.message, tipo: "success" });
        setView("reset_password"); 
      } else {
        setMensagem({ texto: dados.error, tipo: "error" });
      }
    } catch (error) {
      setMensagem({ texto: "Erro ao conectar com o servidor.", tipo: "error" });
    }
  };

  // ação de redefinir a senha (envia e-mail, código e nova senha)
  const handleResetPassword = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch("http://localhost:3000/auth/reset-password", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, code, newPassword })
      });
      const dados = await response.json();

      if (response.ok) {
        setMensagem({ texto: "Senha alterada com sucesso! Faça seu login.", tipo: "success" });
        setView("login");
        setEmail("");
        setNewPassword("");
        setCode("");
      } else {
        setMensagem({ texto: dados.error, tipo: "error" });
      }
    } catch (error) {
      setMensagem({ texto: "Erro ao conectar com o servidor.", tipo: "error" });
    }
  };

  return (
    <Box sx={{ height: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', bgcolor: 'background.default' }}>
      <Paper elevation={4} sx={{ p: 4, width: '100%', maxWidth: 400, borderRadius: 3 }}>
        <Typography variant="h4" align="center" color="primary" sx={{ mb: 1, fontWeight: 'bold' }}>WMS IFSC</Typography>
        
        <Typography variant="body1" align="center" color="textSecondary" sx={{ mb: 3 }}>
          {view === "login" && "Acesso ao Sistema"}
          {view === "register" && "Criar Nova Conta"}
          {view === "forgot" && "Recuperar Senha"}
          {view === "reset_password" && "Definir nova senha"}
        </Typography>

        {mensagem.texto && <Alert severity={mensagem.tipo} sx={{ mb: 3 }}>{mensagem.texto}</Alert>}

        {/* formulário de login */}
        {view === "login" && (
          <form onSubmit={handleLogin}>
            <Stack spacing={2}>
              <TextField label="E-mail" type="email" variant="outlined" fullWidth value={email} onChange={(e) => setEmail(e.target.value)} required />
              <TextField label="Senha" type="password" variant="outlined" fullWidth value={password} onChange={(e) => setPassword(e.target.value)} required />
              <Button type="submit" variant="contained" color="primary" size="large" fullWidth>Entrar</Button>
              
              <Box sx={{ display: 'flex', justifyContent: 'space-between', width: '100%', mt: 2 }}>
                <Link component="button" type="button" variant="body2" onClick={() => mudarTela("register")}>Criar conta</Link>
                <Link component="button" type="button" variant="body2" onClick={() => mudarTela("forgot")}>Esqueci a senha</Link>
              </Box>
            </Stack>
          </form>
        )}

        {/* formulário de cadastro */}
        {view === "register" && (
          <form onSubmit={handleRegister}>
            <Stack spacing={2}>
              <TextField label="Nome Completo" variant="outlined" fullWidth value={name} onChange={(e) => setName(e.target.value)} required />
              <TextField label="E-mail" type="email" variant="outlined" fullWidth value={email} onChange={(e) => setEmail(e.target.value)} required />
              <TextField label="Senha" type="password" variant="outlined" fullWidth value={password} onChange={(e) => setPassword(e.target.value)} required />
              <Button type="submit" variant="contained" color="primary" size="large" fullWidth>Registrar</Button>
              
              <Box textAlign="center" sx={{ mt: 1 }}>
                <Link component="button" type="button" variant="body2" onClick={() => mudarTela("login")}>Voltar para o Login</Link>
              </Box>
            </Stack>
          </form>
        )}

        {/* formulario de esqueci a senha */}
        {view === "forgot" && (
          <form onSubmit={handleForgot}>
            <Stack spacing={2}>
              <TextField label="Digite seu e-mail" type="email" variant="outlined" fullWidth value={email} onChange={(e) => setEmail(e.target.value)} required />
              <Button type="submit" variant="contained" color="primary" size="large" fullWidth>Verificar E-mail</Button>
              
              <Box textAlign="center" sx={{ mt: 1 }}>
                <Link component="button" type="button" variant="body2" onClick={() => mudarTela("login")}>Voltar para o Login</Link>
              </Box>
            </Stack>
          </form>
        )}

        {/* formulário de redefinir a senha */}
        {view === "reset_password" && (
          <form onSubmit={handleResetPassword}>
            <Stack spacing={2}>
              <Typography variant="body2" color="textSecondary">
                Enviamos um código de 6 dígitos para: <strong>{email}</strong>
              </Typography>
              
              <TextField 
                label="Código de Verificação" 
                variant="outlined" 
                fullWidth 
                value={code} 
                onChange={(e) => setCode(e.target.value)} 
                required 
              />

              <TextField 
                label="Nova Senha" 
                type="password" 
                variant="outlined" 
                fullWidth 
                value={newPassword} 
                onChange={(e) => setNewPassword(e.target.value)} 
                required 
              />
              <Button type="submit" variant="contained" color="primary" size="large" fullWidth>Salvar Nova Senha</Button>
              
              <Box textAlign="center" sx={{ mt: 1 }}>
                <Link component="button" type="button" variant="body2" onClick={() => mudarTela("login")}>Cancelar</Link>
              </Box>
            </Stack>
          </form>
        )}
      </Paper>
    </Box>
  );
}