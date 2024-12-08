class AdminEntity {
  constructor({
    _id,
    first_name,
    last_name,
    email,
    avatar,
    role,
    country,
    createdAt,
  }) {
    this._id = _id;
    this.first_name = first_name;
    this.last_name = last_name;
    this.email = email;
    this.avatar = avatar;
    this.role = role;
    this.country = country;
    this.createdAt = createdAt;
  }

  getFullName() {
    return `${this.first_name} ${this.last_name}`;
  }

  getCreatedDate() {
    const createdAtDate = new Date(this.createdAt);
    const formattedDate = createdAtDate.toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
    });

    return formattedDate;
  }
}

export default AdminEntity;
