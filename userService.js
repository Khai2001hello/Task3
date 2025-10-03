// userService.js (ES Modules)
import path from "path";
import fs from "fs";
import * as XLSX from "xlsx";
import { fileURLToPath } from "url";

// Tạo __filename/__dirname trong ESM
const __filename = fileURLToPath(import.meta.url);
const __dirname  = path.dirname(__filename);

// File Excel mặc định
export const DATA_FILE = path.resolve(__dirname, "users.xlsx");

// State trong bộ nhớ
let users = [];

/**
 * Thêm người dùng (bắt buộc name/email, không trùng email)
 */
export function addUser(user) {
  if (!user?.name || !user?.email) {
    throw new Error("User must have a name and email");
  }

  // Chuẩn hoá
  const name  = String(user.name).trim();       
  const email = String(user.email).trim().toLowerCase();

  // Chặn trùng email
  if (users.some(u => String(u.email).trim().toLowerCase() === email)) {
    throw new Error("Email already exists");
  }

  // Tạo id tăng dần
  const nextId = users.length
    ? Math.max(...users.map(u => Number(u.id) || 0)) + 1
    : 1;

  const record = {
    id: nextId,
    name,
    email,
    age: user.age ?? null,
  };

  users.push(record);
  return record;
}

/**
 * Trả về bản sao danh sách (tránh sửa ngoài ý muốn)
 */
export function getAllUsers() {
  return users.map(u => ({ ...u }));
}

/**
 * Ghi ra Excel: sheet "Users"
 */
export function saveUsersToFile(filename = DATA_FILE) {
  const ws = XLSX.utils.json_to_sheet(users);
  const wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, ws, "Users");
  XLSX.writeFile(wb, filename);
  return filename;
}

/**
 * Đọc từ Excel (nếu có), nạp vào `users`
 */
export function loadUsersFromFile(filename = DATA_FILE) {
  if (!fs.existsSync(filename)) {
    users = [];
    return getAllUsers();
  }

  const wb = XLSX.readFile(filename);
  const sheetName = wb.SheetNames[0];
  const ws = wb.Sheets[sheetName];

  const data = XLSX.utils.sheet_to_json(ws, { defval: null });

  users = data
    .map(row => {
      const id    = row.id ?? row.ID ?? row.Id ?? null;
      const name  = row.name ?? row.Name ?? row.NAME ?? "";
      const email = row.email ?? row.Email ?? row.EMAIL ?? "";
      const age   = row.age ?? row.Age ?? row.AGE ?? null;

      return {
        id:  id != null ? Number(id) || null : null,
        name: String(name).trim(),
        email: String(email).trim().toLowerCase(),
        age: age != null ? Number(age) || null : null,
      };
    })
    .filter(u => u.name && u.email);

  return getAllUsers();
}
