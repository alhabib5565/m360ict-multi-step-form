type StepHeaderProps = {
  title: string;
};
const StepHeader = ({ title }: StepHeaderProps) => {
  return (
    <div className="">
      <h2 className="text-center mb-8 text-2xl font-semibold text-gray-900">
        {title}
      </h2>
    </div>
  );
};

export default StepHeader;
