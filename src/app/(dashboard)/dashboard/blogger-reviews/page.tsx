"use client";

import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { RootState } from "@/redux/store";
import { useRouter } from "next/navigation";
import Heading from "@/components/ui/Heading/Heading";
import { Button, Form, Input, Table, Image, Modal, message } from "antd";
import { PlusOutlined, EditOutlined, DeleteOutlined } from "@ant-design/icons";

interface BloggerReview {
  id: string;
  name: string;
  role: string;
  imageUrl: string;
  order: number;
}

export default function BloggerReviewsPage() {
  const router = useRouter();
  const user = useSelector((state: RootState) => state.auth.user);
  const token = useSelector((state: RootState) => state.auth.access_token);
  const [reviews, setReviews] = useState<BloggerReview[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form] = Form.useForm();

  useEffect(() => {
    if (user?.role !== "ADMIN") {
      router.push("/dashboard");
      return;
    }
    fetchReviews();
  }, [user?.role, router]);

  const fetchReviews = async () => {
    try {
      const res = await fetch("/api/blogger-reviews");
      const data = await res.json();
      if (data.success) setReviews(data.data || []);
    } catch {
      message.error("Failed to fetch reviews");
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (values: { name: string; role: string; imageUrl: string; order?: number }) => {
    if (!token) return;
    try {
      const url = editingId ? `/api/blogger-reviews/${editingId}` : "/api/blogger-reviews";
      const method = editingId ? "PUT" : "POST";
      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify({ ...values, order: values.order ?? 0 }),
      });
      const data = await res.json();
      if (data.success) {
        message.success(editingId ? "Review updated" : "Review added");
        setModalOpen(false);
        setEditingId(null);
        form.resetFields();
        fetchReviews();
      } else {
        message.error(data.error || "Failed");
      }
    } catch {
      message.error("Request failed");
    }
  };

  const handleDelete = async (id: string) => {
    if (!token || !confirm("Delete this review?")) return;
    try {
      const res = await fetch(`/api/blogger-reviews/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      if (data.success) {
        message.success("Deleted");
        fetchReviews();
      } else {
        message.error(data.error || "Failed");
      }
    } catch {
      message.error("Request failed");
    }
  };

  const openEdit = (r: BloggerReview) => {
    setEditingId(r.id);
    form.setFieldsValue({ name: r.name, role: r.role, imageUrl: r.imageUrl, order: r.order });
    setModalOpen(true);
  };

  if (user?.role !== "ADMIN") return null;

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <Heading>Blogger Reviews</Heading>
        <Button type="primary" icon={<PlusOutlined />} onClick={() => { setEditingId(null); form.resetFields(); setModalOpen(true); }}>
          Add Review
        </Button>
      </div>
      <p className="text-gray-600 mb-4">
        Manage the &quot;Blogger Reviews&quot; section shown on product detail pages.
      </p>
      <Table
        loading={loading}
        dataSource={reviews}
        rowKey="id"
        columns={[
          { title: "Order", dataIndex: "order", width: 80 },
          {
            title: "Image",
            dataIndex: "imageUrl",
            render: (url: string) => (
              <Image src={url} alt="" width={48} height={48} className="rounded object-cover" />
            ),
          },
          { title: "Name", dataIndex: "name" },
          { title: "Role", dataIndex: "role" },
          {
            title: "Actions",
            render: (_, r) => (
              <div className="flex gap-2">
                <Button size="small" icon={<EditOutlined />} onClick={() => openEdit(r)} />
                <Button size="small" danger icon={<DeleteOutlined />} onClick={() => handleDelete(r.id)} />
              </div>
            ),
          },
        ]}
      />
      <Modal
        title={editingId ? "Edit Review" : "Add Review"}
        open={modalOpen}
        onCancel={() => { setModalOpen(false); setEditingId(null); }}
        footer={null}
      >
        <Form form={form} layout="vertical" onFinish={handleSubmit}>
          <Form.Item name="name" label="Name" rules={[{ required: true }]}>
            <Input placeholder="e.g. Emma Watson" />
          </Form.Item>
          <Form.Item name="role" label="Role" rules={[{ required: true }]}>
            <Input placeholder="e.g. Blogger, Youtuber, Influencer" />
          </Form.Item>
          <Form.Item name="imageUrl" label="Image URL" rules={[{ required: true }]}>
            <Input placeholder="https://..." />
          </Form.Item>
          <Form.Item name="order" label="Order">
            <Input type="number" placeholder="0" />
          </Form.Item>
          <Form.Item>
            <Button type="primary" htmlType="submit">{editingId ? "Update" : "Add"}</Button>
            <Button className="ml-2" onClick={() => setModalOpen(false)}>Cancel</Button>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
}
