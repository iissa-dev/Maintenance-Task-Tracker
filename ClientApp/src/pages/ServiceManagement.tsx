import {useState} from "react";
import ServiceCard from "../features/serviceRequest/components/ServiceCard";
import Sidebar from "../layouts/Sidebar";
import ServiceHandled from "../features/serviceRequest/components/HandleServiceRequest";

import Header from "../layouts/Header.tsx";

function ServiceManagement() {
    const [isOpenForm, setIsOpenForm] = useState(false);

    return (
        <main className="flex min-h-screen bg-background">
            <Sidebar/>
            <div className="flex-1 p-6 md:p-10 max-w-400 mx-auto w-full">
                {/* Modal Handling */}
                <ServiceHandled
                    onClose={() => setIsOpenForm(false)}
                    isOpen={isOpenForm}
                    Mode="Add"
                />

                {/* Header Section */}
                <Header title={"Service Requests"}
                        subtitle={"Monitor and manage all facility maintenance requests in real-time"}
                        buttonText={"Create Request"}
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