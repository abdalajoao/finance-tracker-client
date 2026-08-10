import Sidebar from "./Sidebar";

function MainLayout ({children}) {
    return (
        <div className="flex justify-center ">
           <Sidebar/>
           
           <main>
            {children}
           </main>
        </div>
    )
}


export default MainLayout;