type Props = {
  title: string;
};
function Header({ title }: Props) {
  return (
    <header className="bg-white h-[60px] w-[100%] flex justify-between items-center px-[20px]">
      <h3 className="text-[20px] font-bold">{title}</h3>
    </header>
  );
}

export default Header;
