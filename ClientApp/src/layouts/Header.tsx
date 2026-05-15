import {Plus} from "lucide-react";
import {useAuth} from "../hooks/useAuth.ts";

type Props = {
    title: string;
    subtitle: string;
    showAddButton?: boolean;
    buttonText?: string;
    allowadRoles?: string[];
    addButton?: () => void;
};

function Header({title, subtitle, showAddButton = true, buttonText, allowadRoles, addButton}: Props) {
    const {authToken} = useAuth();
    const role = authToken?.role;

    const canShow = allowadRoles && allowadRoles.includes(role?? "");

    return (
        <header className="mb-10 flex justify-between md:items-center flex-col md:flex-row ">
            <div>
                <h1 className="text-3xl font-bold gradient-text mb-2">{title}</h1>
                <p className="text-sub font-medium">{subtitle}</p>
            </div>
            {showAddButton && canShow ?
                <button onClick={addButton}
                        className={"btn-primary flex items-center gap-2 w-fit md:mt-auto mt-4"}>
                    <Plus size={18}/>
                    <span>{buttonText}</span>
                </button> : ""}
        </header>
    );
}

export default Header;
