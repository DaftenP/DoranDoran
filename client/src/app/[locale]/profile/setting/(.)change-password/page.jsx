import Modal from "@/components/modal/modal";
import ChangePassword from "@/app/[locale]/profile/setting/change-password/page";

export default function InterceptChangePassword() {
  return (
    <Modal>
      <ChangePassword />
    </Modal>
  );
}
