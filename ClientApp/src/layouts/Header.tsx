import {Plus} from "lucide-react";
import {useAuth} from "../hooks/useAuth.ts";

type Props = {
    title: string;
    subtitle: string;
    showAddButton?: boolean;
    buttonText?: string;
    addButton?: () => void;
};

function Header({title, subtitle, showAddButton = true, buttonText, addButton}: Props) {
    const {authToken} = useAuth();
    const role = authToken?.role;
    return (
        <header className="mb-10 flex justify-between items-end">
            <div>
                <h1 className="text-3xl font-bold gradient-text mb-2">{title}</h1>
                <p className="text-sub font-medium">{subtitle}</p>
            </div>
            {showAddButton && role === "Admin" ?
                <button onClick={addButton}
                        className={"btn-primary flex items-center gap-2"}>
                    <Plus size={18}/>
                    <span>{buttonText}</span>
                </button> : ""}
        </header>
    );
}

export default Header;
