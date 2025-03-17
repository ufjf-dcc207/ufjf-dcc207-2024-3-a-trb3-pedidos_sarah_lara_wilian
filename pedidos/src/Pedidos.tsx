import { useState, useEffect} from "react";
import './Pedidos.css';

type Pedidos ={
    id: number;
    produto: string;
    atendido: boolean;
};

export default function Pedidos(){
    const [pedidos,setPedidos] = useState<Pedidos[]>([]);
    const [pedidosAtendidos,setPedidosAtendidos] = useState<Pedidos[]>([]);
    const [loading, setLoading] = useState(false); // Para controlar o estado de carregamento



    const atenderPedido = () => {
        if (pedidos.length > 0) {
            const [pedidoAtendido, ...pedidosFila] = pedidos;
            const pedidoAtendidoCopia = { ...pedidoAtendido, atendido: true }; 
            setPedidosAtendidos([...pedidosAtendidos, pedidoAtendidoCopia]); 
            setPedidos(pedidosFila);
        }
    };

    // Usando useEffect para chamar a API e buscar pedidos
    useEffect(() => {
    const fetchPedidos = async () => {
      setLoading(true); // Define que está carregando
      const response = await fetch(''); //fazer uma solicitação HTTP para a URL da sua API

      if (response.ok) {// se a \ solicitaçao foi bem sucedida
        const data = await response.json();// obter os dados em formato JSON
        setPedidos(data);// armazena esses dados no estado
        //Isso vai atualizar o estado do componente com os pedidos recebidos da API, e a interface será renderizada novamente com esses dados.
      }

      setLoading(false); // Finaliza o carregamento
    };

    fetchPedidos(); // para iniciar o processo de obter os pedidos logo após a montagem do componente.
  }, []); // O useEffect será executado apenas uma vez, após a montagem do componente

    

    return(
        <>
        <div className="cabecalho">
            <h1>Delivery de Pedidos</h1>
            <button onClick={atenderPedido}>Atender pedido</button>
        </div>
       
        {loading && <p>Carregando pedidos...</p>} 
        
        <div className="fila">
            
            
            <div className="pedidos">
              <h2>Pedidos em aberto</h2>
                {pedidos.map((pedidos)=> (
                    <div key={pedidos.id} className="pedido-item">
                        <h2>Pedido {pedidos.id}</h2>
                        <p>produto: {pedidos.produto}</p>
                        <p>Status: {pedidos.atendido ? "Atendido" : "Não Atendido"}</p>
                    </div>
                ))}
            </div>
            
            <div className="pedidosAtendidos">
                <h2>Pedidos finalizados</h2>
                {pedidosAtendidos.map((pedidoAtendido)=> (
                    <div key={pedidoAtendido.id} className="pedidoAtendido-item">
                        <h2>Pedido {pedidoAtendido.id}</h2>
                        <p>produto: {pedidoAtendido.produto}</p>
                        <p>Status: {pedidoAtendido.atendido ? "Atendido" : "Não Atendido"}</p>
                    </div>
                ))}
            </div>
        </div>

        </>
    );
}