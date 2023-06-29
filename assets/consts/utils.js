const utils = {
  mapKey: 'AIzaSyBJ6zS24kzTPQx5iUIDMbypwntacu8fQOM',
  MIN_VALUE: 20,
  MAX_VALUE: 10000,
  formatDateTime: function (dateTime) {
    // Kiểm tra nếu đầu vào không phải là chuỗi hoặc số
    if (typeof dateTime !== 'string' && typeof dateTime !== 'number') {
      throw new Error('Invalid input');
    }

    // Chuyển đổi đầu vào thành chuỗi
    const input = String(dateTime);

    // Lấy giờ và ngày tháng từ chuỗi đầu vào
    const [time, date] = input.split(', ');
    const [hour, minute] = time.split(':');
    const [day, month, year] = date.split('/');

    // Tạo chuỗi đầu ra
    const formattedDateTime = `${hour}:${minute}, ${day}/${month}`;

    return formattedDateTime;
  },
  formatDate: function (dateTime) {
    if (typeof dateTime !== 'string' && typeof dateTime !== 'number') {
      throw new Error('Invalid input');
    }

    // Chuyển đổi đầu vào thành chuỗi
    const input = String(dateTime);

    // Lấy giờ và ngày tháng từ chuỗi đầu vào
    const [time, date] = input.split(', ');
    return `${date}`;
  },
  formatTime: function (dateTime) {
    if (typeof dateTime !== 'string' && typeof dateTime !== 'number') {
      throw new Error('Invalid input');
    }

    // Chuyển đổi đầu vào thành chuỗi
    const input = String(dateTime);

    // Lấy giờ và ngày tháng từ chuỗi đầu vào
    const [time, date] = input.split(', ');
    return `${time}`;
  },
};

export default utils;
