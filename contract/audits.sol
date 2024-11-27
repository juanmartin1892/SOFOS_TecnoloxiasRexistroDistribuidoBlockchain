// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

// Contrato auditorias
contract auditoriasContract {

    //Estructura de evidencias
    struct Evidencia {
        string evidencia;
        uint256 timestamp;
    }

    //Etructura de auditorias 
    struct Auditoria {
        uint id;
        string serviceName;
        address owner;
        string uri;
        string port;
        bool valid;
        uint256 timestamp;
    }

    // Mappign de auditorias
    mapping(uint => Auditoria) public auditorias;
    mapping(uint => Evidencia[]) public evidencias;

    // Evento de auditoria creada
    event AuditoriaCreada(uint id, string serviceName, address owner, string uri, string port, bool valid, uint256 timestamp);
    // Evento de evidencia añadida
    event EvidenciaAnadida(uint id, string evidencia, uint256 timestamp);

    // Variables de smart contract
    string public name;
    address public operator;

    // Constador de auditorias
    uint public auditoriasCount = 0;

    // Constructor
    constructor() {
        name = "auditorias";
        operator = msg.sender;
    }

    // Funcion para crear una auditoria
    function crearAuditoria(string memory _serviceName, string memory _uri, string memory _port) public {
        auditoriasCount++;
        auditorias[auditoriasCount] = Auditoria(auditoriasCount, _serviceName, msg.sender, _uri, _port, true, block.timestamp);
        emit AuditoriaCreada(auditoriasCount, _serviceName, msg.sender, _uri, _port, true, block.timestamp);
    }
   
    // Funcion para añadir una evidencia
    function anadirEvidencia(uint _id, string memory _evidencia) public {
        evidencias[_id].push(Evidencia(_evidencia, block.timestamp));
        emit EvidenciaAnadida(_id, _evidencia, block.timestamp);
    }

    // Funcion para obtener una auditoria
    function obtenerAuditoria(uint _id) public view returns (uint, string memory, address, string memory, string memory, bool, uint256) {
        Auditoria storage auditoria = auditorias[_id];
        return (auditoria.id, auditoria.serviceName, auditoria.owner, auditoria.uri, auditoria.port, auditoria.valid, auditoria.timestamp);
    }

    // Function para obtner las evidencias de una auditoria
    function obtenerEvidencias(uint _id) public view returns (string[] memory, uint256[] memory) {
        Evidencia[] storage evidencia = evidencias[_id];
        string[] memory evidenciasArray = new string[](evidencia.length);
        uint256[] memory timestamps = new uint256[](evidencia.length);
        for (uint i = 0; i < evidencia.length; i++) {
            evidenciasArray[i] = evidencia[i].evidencia;
            timestamps[i] = evidencia[i].timestamp;
        }
        return (evidenciasArray, timestamps);
    }

    // Funcion todas las auditorias
    function obtenerTodasLasAuditorias() public view returns (uint[] memory) {
        uint[] memory result = new uint[](auditoriasCount);
        uint contador = 0;
        for (uint i = 1; i <= auditoriasCount; i++) {
            result[contador] = i;
            contador++;
        }
        return result;
    }
    
}

