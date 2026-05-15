import Header from "../../../layouts/Header";
import Sidebar from "../../../layouts/Sidebar";
import { AtSign, Mail, Phone, ShieldCheck, User } from "lucide-react";
import { useProfile } from "../api/user.mutation";
import { ThreeDot } from "react-loading-indicators";
import { useState } from "react";
import { HandleUser } from "./HandleUser";
import type { UpdateUserDto } from "../../../types";

const formatUser = (userName: string) => {
  if (!userName) return "";

  return userName.replace(userName[0], userName[0].toUpperCase());
};

const UserProfile = () => {
  const [isOpenEditForm, setIsOpenEditForm] = useState(false);
  const [updateUserData, setUpdateUserData] = useState<UpdateUserDto|null>(null);
  const { user, isLoading } = useProfile();

  if (isLoading) {
    return (
      <div className="fixed inset-0 flex items-center justify-center bg-background">
        <ThreeDot
          variant="bounce"
          color="var(--color-primary)"
          size="medium"
          text="LOADING"
          textColor="var(--color-primary)"
        />
      </div>
    );
  }

  const displayFields = user
    ? [
        {
          label: "Full Name",
          value: formatUser(user?.fullName),
          icon: <User size={20} />,
          color: "text-success",
          bg: "bg-success/10",
        },
        {
          label: "Username",
          value: user?.userName,
          icon: <AtSign size={20} />,
          color: "text-primary",
          bg: "bg-primary/10",
        },
        {
          label: "Email",
          value: user?.email,
          icon: <Mail size={20} />,
          color: "text-secondary",
          bg: "bg-muted-foreground/10",
        },
        {
          label: "Role",
          value: user?.role,
          icon: <ShieldCheck size={20} />,
          color: "text-warning",
          bg: "bg-warning/10",
        },
        {
          label: "Phone",
          value:
            user.phoneNumber?.length === 0
              ? "No number added"
              : user.phoneNumber,
          icon: <Phone size={20} />,
          color: "text-danger",
          bg: "bg-danger/10",
        },
      ]
    : [];


    const handleEdit = () => {
      const [firstName, ...rest] = user?.fullName.split(" ") ?? [];
      setUpdateUserData({
        firstName,
        lastName: rest.join(" "),
        email: user?.email ?? "",
        userName: user?.userName ?? "",
        phoneNumber: user?.phoneNumber ?? ""
      });

      setIsOpenEditForm(true);
    } 


  return (
    <div className="flex min-h-screen bg-background">
      <Sidebar />
      <HandleUser
        isOpen={isOpenEditForm}
        onClose={() => setIsOpenEditForm(false)}
        userId={user?.id ?? 0}
        Mode={"Edit"}
        data={updateUserData}
      />

      <main className="flex-1 md:p-8 p-4">
        <Header
          title="Account Profile"
          subtitle="View and manage your personal details"
          showAddButton={true}
          buttonText="Edit Profile"
          allowadRoles={["Client", "Employee", "Admin"]}
          addButton={handleEdit}
        />

        <div>
          <div className="card p-6 mb-6 flex items-center gap-6">
            <div className="w-24 h-24 rounded-full bg-primary/20 border-2 border-primary flex items-center justify-center text-primary text-3xl font-bold">
              {user?.userName?.[0].toUpperCase()}
            </div>
            <div>
              <h2 className="text-2xl font-bold text-white">
                {user?.fullName.toUpperCase()}
              </h2>
              <p className="text-muted-foreground">{user?.role}</p>
            </div>
          </div>

          <div className="card overflow-hidden">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-px bg-border">
              {displayFields.map((field, index) => (
                <div
                  key={index}
                  className="bg-card p-6 flex items-center justify-between hover:bg-white/2 transition-colors"
                >
                  <div className="flex items-center gap-4">
                    <div
                      className={`p-3 rounded-xl ${field.bg} ${field.color}`}
                    >
                      {field.icon}
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">
                        {field.label}
                      </p>
                      <p className="text-lg font-semibold text-white">
                        {field.value}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default UserProfile;
