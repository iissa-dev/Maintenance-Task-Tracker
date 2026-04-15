import {
  faEnvelope,
  faUnlock,
  faUser,
} from "@fortawesome/free-solid-svg-icons";

const INPUTS = [
  {
    type: "text",
    name: "firstName",
    id: "firstName",
    placeholder: "First Name",
    icon: faUser,
    showOnEdit: true,
  },
  {
    type: "text",
    name: "lastName",
    id: "lastName",
    placeholder: "Last Name",
    icon: faUser,
    showOnEdit: true,
  },
  {
    type: "email",
    name: "email",
    id: "email",
    placeholder: "Email",
    icon: faEnvelope,
    showOnEdit: true,
  },
  {
    type: "text",
    name: "userName",
    id: "username",
    placeholder: "User Name",
    icon: faUser,
    showOnEdit: true,
  },
  {
    type: "password",
    name: "password",
    id: "password",
    placeholder: "Password",
    icon: faUnlock,
    showOnEdit: false,
  },
] as const;

export { INPUTS };
