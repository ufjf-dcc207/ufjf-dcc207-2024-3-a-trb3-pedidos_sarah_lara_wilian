import { useState, useEffect, useRef} from "react";
import axios from 'axios';
import './Pedidos.css';

type Pedidos ={
    id: number;
    produto: string;
    atendido: boolean;
};

export default function Pedidos(){
    const URL = 'https://script.google.com/macros/s/AKfycbz8_qgJHSRDMwe2fvMApZNx9XQVaukzkq-MbjdOuG8Zb6To0bko_1vtDzNVG_9pkWys/exec';
    const zapier = 'https://hooks.zapier.com/hooks/catch/22089640/2lfjq9n/';
    const proxyURL = 'http://localhost:3001/zapier';

    const [pedidos,setPedidos] = useState<Pedidos[]>([]);
    const [pedidosAtendidos,setPedidosAtendidos] = useState<Pedidos[]>([]);
    const [loading, setLoading] = useState(false); // Para controlar o estado de carregamento
    const pedidoRecebidorRef = useRef<EventSource | null>(null);


    const atenderPedido = async () => {
        if (pedidos.length > 0) {
            const [pedidoAtendido, ...pedidosFila] = pedidos;
            const pedidoAtendidoCopia = { ...pedidoAtendido, atendido: true }; 
            try{
                await axios.post(proxyURL,pedidoAtendidoCopia
                );
                console.log(pedidoAtendidoCopia);
                setPedidosAtendidos([...pedidosAtendidos, pedidoAtendidoCopia]); 
                setPedidos(pedidosFila);
            }catch (e){
                console.error('Erro ao enviar atualização para o Zapier:',e)
            }
        }
    };


    const fetchPedidos = async () => {
      setLoading(true); // Define que está carregando
      try{
        const response = await axios.get(URL); //fazer uma solicitação HTTP para a URL da sua API
        console.log('Dados retornados pela API:',response.data);
        const fetchedPedidos = response.data.map((pedido:any)=>{
            const atendido = pedido.atendido;
            return {
                id: Number(pedido.id),
                produto: pedido.produto.replace(/\n/g, " "),
                atendido: atendido,
            }; 
        });
        setPedidos(fetchedPedidos.filter((p: { atendido: any; }) => !p.atendido));
        setPedidosAtendidos(fetchedPedidos.filter((p: { atendido: any; }) => p.atendido));
        // armazena esses dados no estado
        //Isso vai atualizar o estado do componente com os pedidos recebidos da API, e a interface será renderizada novamente com esses dados.
      }catch(e){
        console.error('Erro ao buscar pedidos:',e);
      }

      setLoading(false); // Finaliza o carregamento
    };
    
    // Usando useEffect para chamar a API e buscar pedidos
    useEffect(() => {
        fetchPedidos(); // para iniciar o processo de obter os pedidos logo após a montagem do componente.
        pedidoRecebidorRef.current = new EventSource(zapier);
        pedidoRecebidorRef.current.onmessage=()=>{
            fetchPedidos();
        };
        return ()=> pedidoRecebidorRef.current?.close();
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