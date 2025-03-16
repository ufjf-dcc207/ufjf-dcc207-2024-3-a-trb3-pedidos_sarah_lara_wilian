import { useState } from "react";
import './Pedidos.css';

type Pedidos ={
    id: number;
    produto: string;
    atendido: boolean;
};

export default function Pedidos(){
    const [pedidos,setPedidos] = useState<Pedidos[]>([]);
    const [pedidosAtendidos,setPedidosAtendidos] = useState<Pedidos[]>([]);
    const [produto,setProduto] = useState("");
    const [contador, setContador] = useState(1);

    const adicionarPedido = ()=>{
        if(produto!=""){
            const novoPedido: Pedidos = {
                id: contador,
                produto:produto,
                atendido: false
            };
            setPedidos([...pedidos,novoPedido]);
            setProduto("");
            setContador(contador+1);
        }
    };


    const atenderPedido = () => {
        if (pedidos.length > 0) {
            const [pedidoAtendido, ...pedidosFila] = pedidos;
            const pedidoAtendidoCopia = { ...pedidoAtendido, atendido: true }; 
            setPedidosAtendidos([...pedidosAtendidos, pedidoAtendidoCopia]); 
            setPedidos(pedidosFila);
        }
    };
    

    return(
        <>
        <div className="cabecalho">
            <h1>Delivery de Pedidos</h1>
            <input type="text"
            placeholder="Informe o produto"
            value={produto}
            onChange={(e)=>setProduto(e.target.value)} />

            <button onClick={adicionarPedido}>Adicionar produto</button>
            <button onClick={atenderPedido}>Atender pedido</button>
        </div>
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