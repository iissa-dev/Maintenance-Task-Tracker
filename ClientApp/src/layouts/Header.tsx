type Props = {
  title: string;
};
function Header({ title }: Props) {
  return (
    <header className="bg-white h-15 w-full flex justify-between items-center px-5">
      <h3 className="text-[20px] font-bold">{title}</h3>
    </header>
  );
}

export default Header;
