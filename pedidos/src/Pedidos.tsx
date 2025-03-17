import { useReducer, useEffect, useRef} from "react";
import axios from 'axios';
import './Pedidos.css';

type Pedido ={
    id: number;
    produto: string;
    atendido: boolean;
};

type Estado = {
    pedidos: Pedido[];
    pedidosAtendidos: Pedido[];
    carregandoPedidos: boolean;
};

type Acao =
    |{type:"SET_PEDIDOS"; pedidos: Pedido[]}
    |{type:"ATENDER_PEDIDO"; pedido: Pedido}
    |{type:"SET_CARREGANDO"; carregandoPedidos: boolean};

    const reducer = (state: Estado,action:Acao): Estado=>{
        switch (action.type) {
            case "SET_PEDIDOS":
              return {...state,
                    pedidos: action.pedidos.filter(p=>!p.atendido),
                    pedidosAtendidos: action.pedidos.filter(p=>p.atendido),
                    carregandoPedidos:false,
            };
            case "ATENDER_PEDIDO":
                return {
                    pedidos: state.pedidos.filter((p)=>p.id!== action.pedido.id),
                    pedidosAtendidos: [...state.pedidosAtendidos,{...action.pedido,atendido:true}],
                    carregandoPedidos: false,
            };
            case "SET_CARREGANDO":
                return {...state, carregandoPedidos:action.carregandoPedidos};
            default:
              return state;
        }
    };


export default function Pedidos(){
    const URL = 'https://script.google.com/macros/s/AKfycbz8_qgJHSRDMwe2fvMApZNx9XQVaukzkq-MbjdOuG8Zb6To0bko_1vtDzNVG_9pkWys/exec';
    const zapier = 'https://hooks.zapier.com/hooks/catch/22089640/2lfjq9n/';
    const proxyURL = 'http://localhost:3001/zapier';

    const [state,dispatch] = useReducer(reducer,{pedidos:[],pedidosAtendidos:[],carregandoPedidos:false});
    const pedidoRecebidorRef = useRef<EventSource | null>(null);
    


   const atenderPedido = async () => {
        if (state.pedidos.length > 0) {
            const pedidoAtendido = state.pedidos[0];
            try{
                await axios.post(proxyURL,{...pedidoAtendido, atendido:true});
                console.log(pedidoAtendido);
                dispatch({type:"ATENDER_PEDIDO",pedido: pedidoAtendido});
            }catch (e){
                console.error('Erro ao enviar atualização para o Zapier:',e)
            }
        }
    };


    const fetchPedidos = async () => {
        dispatch({type:"SET_CARREGANDO", carregandoPedidos: true});
      try{
        const response = await axios.get(URL); 
        console.log('Dados retornados pela API:',response.data);
        const fetchedPedidos = response.data.map((pedido:any)=>({
            id: Number(pedido.id),
            produto: pedido.produto.replace(/\n/g, " "),
            atendido: pedido.atendido,
        }));
        
        dispatch({type:"SET_PEDIDOS",pedidos:fetchedPedidos});

      }catch(e){
        console.error('Erro ao buscar pedidos:',e);
        dispatch({type:"SET_CARREGANDO", carregandoPedidos: false});
      }
    };
    
    useEffect(() => {
        fetchPedidos();  
        pedidoRecebidorRef.current = new EventSource(zapier);
        pedidoRecebidorRef.current.onmessage=()=> fetchPedidos();
        return ()=> pedidoRecebidorRef.current?.close();
    }, []); 

    

    return(
        <>
        <div className="cabecalho">
            <h1>Delivery de Pedidos</h1>
            <button onClick={atenderPedido}>Atender pedido</button>
            <button onClick={fetchPedidos}>Carregar pedidos</button>
        </div>

        {state.carregandoPedidos && <h3>Carregando pedidos...</h3>}
        
        <div className="fila">
            <div className="pedidos">
              <h2>Pedidos em aberto</h2>
                {state.pedidos.length>0?(
                    state.pedidos.map((pedidos)=> (
                    <div key={pedidos.id} className="pedido-item">
                        <h2>Pedido {pedidos.id}</h2>
                        <p>produto: {pedidos.produto}</p>
                        <p>Status: {pedidos.atendido ? "Atendido" : "Não Atendido"}</p>
                    </div>
                ))
            ):(
                <h3>Nenhum pedido em aberto.</h3>
            )}
            </div>
            
            <div className="pedidosAtendidos">
                <h2>Pedidos finalizados</h2>
                {state.pedidosAtendidos.length>0?(
                    state.pedidosAtendidos.map((pedidoAtendido)=> (
                    <div key={pedidoAtendido.id} className="pedidoAtendido-item">
                        <h2>Pedido {pedidoAtendido.id}</h2>
                        <p>produto: {pedidoAtendido.produto}</p>
                        <p>Status: {pedidoAtendido.atendido ? "Atendido" : "Não Atendido"}</p>
                    </div>
                ))
            ):(
                <h3>Nenhum pedido finalizado.</h3>
            )}
            </div>
        </div>

        </>
    );
}