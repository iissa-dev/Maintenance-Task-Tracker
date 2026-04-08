import { useState } from "react";
import ServiceCard from "../components/ServiceCard";
import Sidebar from "../layouts/Sidebar";
import ServiceHandled from "../forms/ServiceHandled";

function ServiceManagement() {
  const [isOpenForm, setIsOpenForm] = useState(false);

  return (
    <main className="flex">
      <Sidebar />
      <div className="flex-1 p-5 md:p-8">
        <ServiceHandled
          onClose={() => setIsOpenForm(false)}
          isOpen={isOpenForm}
          Mode="Add"
        />

        <header className="mb-10 flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold gradient-text neon-text-purple">
              Service Requests
            </h1>
            <p className="text-soft">
              Real-time status of your facility requests
            </p>
          </div>
          <button
            onClick={() => setIsOpenForm(true)}
            className="btn-primary px-4 py-2 rounded-lg font-medium transition"
          >
            + New Request
          </button>
        </header>
        <section>
          <ServiceCard />
        </section>
      </div>
    </main>
  );
}

export default ServiceManagement;
