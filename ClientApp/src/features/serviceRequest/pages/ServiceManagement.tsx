import { useState } from "react";
import Header from "../../../layouts/Header";
import ServiceCard from "../components/ServiceCard";
import ServiceHandled from "../components/HandleServiceRequest"
import Sidebar from "../../../layouts/Sidebar";

function ServiceManagement() {
    const [isOpenForm, setIsOpenForm] = useState(false);

    return (
        <main className="flex min-h-screen bg-background">
            <Sidebar/>
            <div className="flex-1 p-4 md:p-6 max-w-400 mx-auto w-full">
                {/* Modal Handling */}
                <ServiceHandled
                    onClose={() => setIsOpenForm(false)}
                    isOpen={isOpenForm}
                    Mode="Add"
                />

                {/* Header Section */}
                <Header title={"Service Requests"}
                        subtitle={"Monitor and manage all facility maintenance requests in real-time"}
                        buttonText={"Create Service"}
                        allowadRoles={["Admin"]}
                        addButton={() => setIsOpenForm(true)}/>

                {/* Content Section */}
                <section className="animate-in fade-in duration-500">
                    <ServiceCard/>
                </section>
            </div>
        </main>
    );
}

export default ServiceManagement;