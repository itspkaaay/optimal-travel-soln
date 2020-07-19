onload = function(){
    document.body.style.zoom="98%";
    const map1= document.getElementById('map1');
    const gen_new_btn= document.getElementById('create_graph');
    const solve_graph= document.getElementById('solve_graph');
    const map2= document.getElementById('map2');
    
    options={

        autoResize: true,
            edges: {
                
                font: {
                    size: 20
                }
            },
            nodes: {
                font: '12px arial red',
                scaling: {
                    label: true
                },
                shape: 'icon',
                icon: {
                    face: 'FontAwesome',
                    code: '\uf015',
                    size: 40,
                    color: '#991133',
                }
            }

    }

    ///// creates the problem statement
    function create_data(){
        const network = new vis.Network(map1);
        
        const cities= ["Delhi","Gurgaon","Chennai","Mumbai","Goa","Ahmedabad","Bangalore","Kolkata","Bihar","Ladakh"];
        let V=[];
        for(let i=0;i<cities.length;i++)
        {
            V.push({id:i,label:cities[i]});
        }
        let nE= Math.floor(Math.random()*cities.length)+cities.length;
        
        let E=[];
        for(let i=1;i<nE;i++)
        {
            let dist= Math.floor(Math.random()*50)+50;
            let src= Math.floor((Math.random()*i)%cities.length);
            let neigh= Math.floor(Math.random()*(i+1))%cities.length;
            while(src===neigh)
            {
                
                neigh= Math.floor(Math.random()*cities.length);
            }
           
            E.push({from:src, to:neigh, label: String(dist) });
        }

        const data={
            nodes : V,
            edges : E,
        }
        
        sp= Math.floor(Math.random()*data["nodes"].length);
        ep= Math.floor(Math.random()*data["nodes"].length);
        
        while(sp===ep)
        {
            ep= Math.floor(Math.random()*data["nodes"].length);
        }
        prob_stmt="Finding the shortest route from "+V[sp]['label']+" to "+V[ep]['label'];
        map2.innerHTML=prob_stmt;
        network.setOptions(options);
        network.setData(data);
        
        return data;
    }
    //// generating new problems on button click action
    gen_new_btn.onclick = function () {
        
        data = create_data();                     ///// creates and displays the graph
        
    };
    /// returns adjacency matrix of the graph
    function create_graph(V,E)
    {
    // V is the number of vertices 
    // E is the graph
    
    adj_mat= [];
    for(let i =0;i<V;i++)
    {
        adj_mat.push([]);
    }

    for (let i =0;i<E.length;i++)
    {
        adj_mat[E[i][0]].push([E[i][1],E[i][2]]);
        adj_mat[E[i][1]].push([E[i][0],E[i][2]]);
    }
    return adj_mat;

    };
    /// solves min cost travel and returns distance matrix
    function djikstras(adj_mat,src,V)
{
    let visited= Array(V).fill(false);
    dist=[];
    visited[src]= true;

    for(let i=0;i<V;i++)
    {
        dist.push([1000,-1]);
    }
    dist[src][0]=0;


    //// src condition dealt with
    for( let i =0;i< adj_mat[src].length;i++)
    {
        
        let edge= adj_mat[src][i];
        let neighbour= edge[0];
        let edge_len= edge[1];
        dist[neighbour][0]= Math.min(dist[neighbour][0],edge_len);
        dist[neighbour][1]=src;
        
       
    }
    /// find min index
    for(let i =0;i<V;i++)
    {
       
        let minIndex=-1;
        for(let j=0;j<V;j++)
        {
            
            if(visited[j]===false && (minIndex===-1 || dist[j][0]<dist[minIndex][0]))
            {
                
                
                minIndex=j;
                
            
            }
        }
      
        visited[minIndex]=true;
        if(minIndex!=-1){
        
        };
        
        

        /// exploring neighbours of minimum index node
        if(minIndex!=-1){
        for(let j=0;j<adj_mat[minIndex].length;j++)
        {
            let edge= adj_mat[minIndex][j];
            let neigh= edge[0];
            let nd=edge[1];
            if(visited[neigh]===false)
            {
                if(dist[neigh][0]>dist[minIndex][0]+nd){
                    dist[neigh][0]=dist[minIndex][0]+nd;
                    dist[neigh][1]=minIndex;
                    
                }
            }
        }
    }
    }

    



return dist;
    };
    
    /// creates and displays graph solution
    function soln_graph(d_mat,sp,ep)
    {
        const network_soln= new vis.Network(map2);
        let edges_soln=[];

        const data_soln={
            nodes: data["nodes"],
            edges: edges_soln,
        };


        var cn=ep;
        var pathAvailable= false;
        stmt=document.getElementById('prob_statement');
        stmt.style.marginLeft="25px";
        spantext= "Optimal Path from "+ data["nodes"][sp]["label"] + " to "+data["nodes"][ep]["label"];
        stmt.style.marginLeft="50%";
        stmt.innerHTML=spantext;
        while(sp!=cn)
        {
            let parent= d_mat[cn][1];
            if(parent=== -1 && cn!=sp)
            {
                let alertString="Oops no path from "+data["nodes"][sp]["label"]+" to "+data["nodes"][ep]["label"];
                window.alert(alertString);
                break;
            } 
          
            let d_cn= d_mat[cn][0];
            
            let d_par= d_mat[parent][0];
            
            if(d_par===-1){
                d_p2c= d_cn;
            }
            else{
                d_p2c= d_cn - d_par;
            }
            
            edges_soln.push({from: parent, to: cn, label:String(d_p2c)});
            cn=parent;
            if(cn===sp)
            {
                pathAvailable=true;
            }

        }

        if(pathAvailable===true)
        {
            data_soln["edges"]=edges_soln;
        }
        network_soln.setOptions(options);
        network_soln.setData(data_soln);

        return data_soln;
    }

    
    function solve(){
        let n= data['nodes'];
        let e= data['edges'];

        edge_list=[];
        for(let i =0;i<e.length;i++)
        {
            let curr_edge= e[i];
            let n1= curr_edge['from'];
            let n2= curr_edge['to'];
            let d1_2= parseInt(curr_edge['label']);
            edge_list.push([n1,n2,d1_2]);
        }
       // console.log("button->",edge_list);

        adj_mat=create_graph(n.length,edge_list);
        //console.log("adj mat-",adj_mat);

        return djikstras(adj_mat,sp,n.length);






    };

    /// solver controller
    solve_graph.onclick = function(){
        d_mat=solve();
        data_soln= soln_graph(d_mat,sp,ep);                   /// display and generate solution graph
    }
 
    
};



