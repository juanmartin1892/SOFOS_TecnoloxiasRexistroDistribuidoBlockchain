import React, { useEffect, useState } from "react";
import './App.css';
import { ethers } from "ethers";
import logo from "./logo.png";
import { addresses, abis } from "./contracts";

function App() {
  const [provider, setProvider] = useState(null);
  const [contract, setContract] = useState(null);
  const [serviceName, setServiceName] = useState("");
  const [uri, setUri] = useState("");
  const [port, setPort] = useState("");
  const [auditorias, setAuditorias] = useState([]);
  const [loading, setLoading] = useState(false);

  // Conectar con MetaMask y cargar el contrato
  useEffect(() => {
    async function setup() {
      if (window.ethereum) {
        const web3Provider = new ethers.providers.Web3Provider(window.ethereum);
        await window.ethereum.request({ method: "eth_requestAccounts" });
        const signer = web3Provider.getSigner();
        setProvider(web3Provider);
        setContract(new ethers.Contract(addresses.audits, abis.audits, signer));
      } else {
        alert("Please install MetaMask!");
      }
    }
    setup();
  }, []);

  // Crear una nueva auditoría
  const handleCreateAuditoria = async () => {
    if (!contract || !serviceName || !uri || !port) return;
    try {
      const tx = await contract.crearAuditoria(serviceName, uri, port);
      await tx.wait();
      alert("Auditoría creada exitosamente.");
      fetchAuditorias(); // Actualizar el listado de auditorías
    } catch (error) {
      console.error("Error creando auditoría:", error);
    }
  };
  
  // Obtener todas las auditorías
  const fetchAuditorias = async () => {
    if (!contract) return;

    setLoading(true);
    try {
      const ids = await contract.obtenerTodasLasAuditorias();
      const auditoriasList = await Promise.all(
        ids.map(async (id) => {
          const auditoria = await contract.obtenerAuditoria(id);
          return {
            id: id.toNumber(),
            serviceName: auditoria[1],
            owner: auditoria[2],
            uri: auditoria[3],
            port: auditoria[4],
            valid: auditoria[5],
            timestamp: new Date(auditoria[6] * 1000).toLocaleString(),
            evidencias: [] // Añadimos campo para almacenar evidencias.
          };
        })
      );
      setAuditorias(auditoriasList);
    } catch (error) {
      console.error("Error fetching auditorías:", error);
    }
    setLoading(false);
  };

  // Obtener evidencias de una auditoría
  const fetchEvidencias = async (auditoriaId) => {
    if (!contract) return;

    try {
      const [evidencias, timestamps] = await contract.obtenerEvidencias(auditoriaId);
      return evidencias.map((evidencia, index) => ({
        cid: evidencia,
        timestamp: new Date(timestamps[index] * 1000).toLocaleString()
      }));
    } catch (error) {
      console.error("Error fetching evidencias:", error);
      return [];
    }
  };

  // Mostrar u ocultar evidencias de una auditoría
  const toggleEvidencias = async (auditoriaId) => {
    const updatedAuditorias = [...auditorias];
    const index = updatedAuditorias.findIndex((auditoria) => auditoria.id === auditoriaId);
    if (index !== -1) {
      if (updatedAuditorias[index].evidencias.length === 0) {
        updatedAuditorias[index].evidencias = await fetchEvidencias(auditoriaId);
      } else {
        updatedAuditorias[index].evidencias = [];
      }
      setAuditorias(updatedAuditorias);
    }
  };

  // Actualizar el listado de auditorías al cargar la página
  useEffect(() => {
    fetchAuditorias();
  }, [contract]);

  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} alt="App Logo" className="App-logo" />
        <h1>Auditorías e Evidencias</h1>
        <div className="form-container">
          <div className="form-section">
            <h2>Crear Auditoría</h2>
            <input
              type="text"
              placeholder="Nombre del Servicio"
              value={serviceName}
              onChange={(e) => setServiceName(e.target.value)}
              className="input-field"
            />
            <input
              type="text"
              placeholder="URI del Servicio"
              value={uri}
              onChange={(e) => setUri(e.target.value)}
              className="input-field"
            />
            <input
              type="text"
              placeholder="Puerto del Servicio"
              value={port}
              onChange={(e) => setPort(e.target.value)}
              className="input-field"
            />
            <button onClick={handleCreateAuditoria} className="button">
              Crear Auditoría
            </button>
          </div>

          <div className="form-section">
            <h2>Listado de Auditorías</h2>
            <button onClick={fetchAuditorias} className="button">
              {loading ? "Cargando..." : "Actualizar Auditorías"}
            </button>
            <div className="auditorias-list">
              {auditorias.map((auditoria) => (
                <div key={auditoria.id} className="auditoria-item">
                  <h3>{auditoria.serviceName}</h3>
                  <p><strong>ID:</strong> {auditoria.id}</p>
                  <p><strong>Propietario:</strong> {auditoria.owner}</p>
                  <p><strong>URI:</strong> {auditoria.uri}</p>
                  <p><strong>Puerto:</strong> {auditoria.port}</p>
                  <p><strong>Validez:</strong> {auditoria.valid ? "Válida" : "Inválida"}</p>
                  <p><strong>Creada en:</strong> {auditoria.timestamp}</p>
                  <button onClick={() => toggleEvidencias(auditoria.id)} className="button">
                    {auditoria.evidencias.length > 0 ? "Ocultar Evidencias" : "Mostrar Evidencias"}
                  </button>
                  {auditoria.evidencias.length > 0 && (
                    <ul className="evidencias-list">
                      {auditoria.evidencias.map((evidencia, index) => (
                        <li key={index}>
                          <a href={`https://ipfs.io/ipfs/${evidencia.cid}`} target="_blank" rel="noopener noreferrer">
                            {evidencia.cid}
                          </a>
                          <p>{evidencia.timestamp}</p>
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      </header>
    </div>
  );
}

export default App;
