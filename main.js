// main.js
import {
  addUser,
  getAllUsers,
  saveUsersToFile,
  loadUsersFromFile,
  DATA_FILE,
} from "./userService.js";

function run() {
  // 1) (tuỳ chọn) nạp dữ liệu cũ nếu file đã tồn tại
  loadUsersFromFile();

  // 2) thêm 3 user mẫu
  try {
    addUser({ name: "Trần Anh Khải", email: "khai@example.com", age: 24 });
    addUser({ name: "Phạm Hồng Việt", email: "viet@example.com", age: 23 });
    addUser({ name: "Thu Vân", email: "van@example.com", age: 24 });

    // Ví dụ test trùng email (bật để xem throw):
    // addUser({ name: "Ai đó", email: "Viet@Example.com" });
  } catch (e) {
    console.error("Add user error:", e.message);
  }

  // 3) in danh sách hiện tại
  console.log("Danh sách trong bộ nhớ:");
  console.table(getAllUsers());

  // 4) lưu ra Excel
  const saved = saveUsersToFile();
  console.log("Đã lưu vào:", saved);

  // 5) đọc lại từ file và in ra
  const reloaded = loadUsersFromFile();
  console.log("Đọc lại từ file:", DATA_FILE);
  console.table(reloaded);
}

run();
