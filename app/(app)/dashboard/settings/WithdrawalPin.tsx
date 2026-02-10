"use client";

export default function WithdrawalPin() {
  const [pin, setPin] = useState({
    password: "",
    newPin: "",
    confirmPin: "",
  });

  const [isPending, startTransition] = useTransition();

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    const { name, value } = e.target;
    setPin((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    startTransition(async () => {
      const response = await updatePinAction({
        pin: pin.newPin,
        confirmPin: pin.confirmPin,
        password: pin.password,
      });

      if (!response.success) {
        toast.error(response.message);
      } else {
        toast.success(response.message);
      }
      startTransition(() => {
        setPin({
          password: "",
          newPin: "",
          confirmPin: "",
        });
      });
    });
  };

  return (
    
  );
}
