"use client"

import { useState } from "react"
import { PenSquare } from "lucide-react"
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"

import type { SectionCommonProps } from "./types"

type Employee = {
  name: string
  email: string
  phone: string
  device: string
  status: "active" | "invited" | "inactive"
}

const statusClasses: Record<string, string> = {
  active: "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400",
  invited: "bg-amber-500/10 text-amber-600 dark:text-amber-300",
  inactive: "bg-slate-500/10 text-white dark:text-slate-300",
}

export function StaffSection({ dir, isRTL, t }: SectionCommonProps) {
  const [isAddOpen, setIsAddOpen] = useState(false)
  const [isEditOpen, setIsEditOpen] = useState(false)
  const [editingEmployee, setEditingEmployee] = useState<Employee | null>(null)
  const [newEmployeeName, setNewEmployeeName] = useState("")
  const [newEmployeeEmail, setNewEmployeeEmail] = useState("")
  const [newEmployeePhone, setNewEmployeePhone] = useState("")

  const employees: Employee[] = [
    {
      name: "Noura Al-Qahtani",
      email: "noura@example.com",
      phone: "+966 50 123 4567",
      device: "iPhone 15 • iOS 17",
      status: "active",
    },
    {
      name: "Omar Al-Mutairi",
      email: "omar@example.com",
      phone: "+966 50 234 5678",
      device: "Galaxy S23 • Android 14",
      status: "invited",
    },
    {
      name: "Layla Hassan",
      email: "layla@example.com",
      phone: "+966 50 345 6789",
      device: "MacBook Pro • macOS 14",
      status: "inactive",
    },
  ]

  const roles = [
    {
      name: t("settings.detail.staff.roles.examples.manager.name"),
      type: t("settings.detail.staff.roles.examples.manager.type"),
      members: 5,
    },
    {
      name: t("settings.detail.staff.roles.examples.support.name"),
      type: t("settings.detail.staff.roles.examples.support.type"),
      members: 3,
    },
    {
      name: t("settings.detail.staff.roles.examples.viewer.name"),
      type: t("settings.detail.staff.roles.examples.viewer.type"),
      members: 8,
    },
  ]

  const handleAddEmployee = () => {
    // TODO: add employee logic
    setNewEmployeeName("")
    setNewEmployeeEmail("")
    setNewEmployeePhone("")
    setIsAddOpen(false)
  }

  const handleEditEmployee = (employee: Employee) => {
    setEditingEmployee(employee)
    setNewEmployeeName(employee.name)
    setNewEmployeeEmail(employee.email)
    setNewEmployeePhone(employee.phone)
    setIsEditOpen(true)
  }

  const handleSaveEdit = () => {
    // TODO: update employee logic
    setIsEditOpen(false)
    setEditingEmployee(null)
    setNewEmployeeName("")
    setNewEmployeeEmail("")
    setNewEmployeePhone("")
  }

  return (
    <Tabs defaultValue="employees" className="w-full" dir={dir}>
      <TabsList className="grid w-full grid-cols-2 md:w-auto">
        <TabsTrigger value="employees">
          {t("settings.detail.staff.tabs.employees")}
        </TabsTrigger>
        <TabsTrigger value="roles">
          {t("settings.detail.staff.tabs.roles")}
        </TabsTrigger>
      </TabsList>

      <TabsContent value="employees" className="space-y-6">
        <Card className="border-border/60 bg-background/60 shadow-sm">
          <CardHeader className={isRTL ? "text-right" : "text-left"}>
            <CardTitle>{t("settings.detail.staff.employees.title")}</CardTitle>
            <CardDescription>
              {t("settings.detail.staff.employees.description")}
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div
              className={`flex flex-col gap-4 md:flex-row md:items-center md:justify-between ${
                isRTL ? "md:flex-row-reverse" : ""
              }`}
            >
              <div className={isRTL ? "text-right" : "text-left"}>
                <h3 className="text-base font-semibold text-foreground">
                  {t("settings.detail.staff.employees.subtitle")}
                </h3>
                <p className="text-sm text-muted-foreground">
                  {t("settings.detail.staff.employees.helper")}
                </p>
              </div>
              <Dialog open={isAddOpen} onOpenChange={setIsAddOpen}>
                <DialogTrigger asChild>
                  <Button className="self-start md:self-auto">
                    {t("settings.detail.staff.employees.add")}
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>{t("settings.detail.staff.employees.add")}</DialogTitle>
                    <DialogDescription>
                      {t("settings.detail.staff.employees.addDescription") || "Add a new team member to your store"}
                    </DialogDescription>
                  </DialogHeader>
                  <div className="space-y-4 py-4">
                    <div className="space-y-2">
                      <Label htmlFor="employee-name">{t("settings.detail.staff.employees.table.name")}</Label>
                      <Input
                        id="employee-name"
                        value={newEmployeeName}
                        onChange={(e) => setNewEmployeeName(e.target.value)}
                        placeholder={t("common.name") || "Full Name"}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="employee-email">{t("common.email") || "Email"}</Label>
                      <Input
                        id="employee-email"
                        type="email"
                        value={newEmployeeEmail}
                        onChange={(e) => setNewEmployeeEmail(e.target.value)}
                        placeholder={t("common.emailPlaceholder") || "employee@example.com"}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="employee-phone">{t("common.phone") || "Phone"}</Label>
                      <Input
                        id="employee-phone"
                        type="tel"
                        value={newEmployeePhone}
                        onChange={(e) => setNewEmployeePhone(e.target.value)}
                        placeholder={t("common.phonePlaceholder") || "+966 50 123 4567"}
                      />
                    </div>
                  </div>
                  <DialogFooter>
                    <Button variant="outline" onClick={() => setIsAddOpen(false)}>
                      {t("common.cancel") || "Cancel"}
                    </Button>
                    <Button onClick={handleAddEmployee}>
                      {t("common.add") || "Add"}
                    </Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>

              <Dialog open={isEditOpen} onOpenChange={setIsEditOpen}>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>{t("settings.detail.staff.employees.edit") || "Edit Employee"}</DialogTitle>
                    <DialogDescription>
                      {t("settings.detail.staff.employees.editDescription") || "Update team member information"}
                    </DialogDescription>
                  </DialogHeader>
                  <div className="space-y-4 py-4">
                    <div className="space-y-2">
                      <Label htmlFor="edit-employee-name">{t("settings.detail.staff.employees.table.name")}</Label>
                      <Input
                        id="edit-employee-name"
                        value={newEmployeeName}
                        onChange={(e) => setNewEmployeeName(e.target.value)}
                        placeholder={t("common.name") || "Full Name"}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="edit-employee-email">{t("common.email") || "Email"}</Label>
                      <Input
                        id="edit-employee-email"
                        type="email"
                        value={newEmployeeEmail}
                        onChange={(e) => setNewEmployeeEmail(e.target.value)}
                        placeholder={t("common.emailPlaceholder") || "employee@example.com"}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="edit-employee-phone">{t("common.phone") || "Phone"}</Label>
                      <Input
                        id="edit-employee-phone"
                        type="tel"
                        value={newEmployeePhone}
                        onChange={(e) => setNewEmployeePhone(e.target.value)}
                        placeholder={t("common.phonePlaceholder") || "+966 50 123 4567"}
                      />
                    </div>
                  </div>
                  <DialogFooter>
                    <Button variant="outline" onClick={() => setIsEditOpen(false)}>
                      {t("common.cancel") || "Cancel"}
                    </Button>
                    <Button onClick={handleSaveEdit}>
                      {t("common.save") || "Save"}
                    </Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            </div>

            <div className="space-y-4">
              <div className="space-y-3 md:hidden">
                {employees.map((employee) => (
                  <Card
                    key={employee.name}
                    className="border border-border/60 shadow-sm"
                  >
                    <CardContent className="space-y-3 py-4 text-sm">
                      <div
                        className={`flex items-center justify-between ${
                          isRTL ? "flex-row-reverse" : ""
                        }`}
                      >
                        <span className="font-medium text-foreground">
                          {employee.name}
                        </span>
                        <Badge
                          className={`${statusClasses[employee.status] ?? ""}`}
                        >
                          {t(
                            `settings.detail.staff.employees.status.${employee.status}`
                          )}
                        </Badge>
                      </div>
                      <div className="space-y-1 text-sm text-muted-foreground">
                        <p className="font-medium">
                          {t("settings.detail.staff.employees.table.device")}
                        </p>
                        <p className="break-words">{employee.device}</p>
                      </div>
                      <div className={`flex items-center gap-2 ${isRTL ? "flex-row-reverse" : ""}`}>
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => handleEditEmployee(employee)}
                          className="flex items-center gap-1"
                        >
                          <PenSquare className="h-4 w-4" />
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>

              <div
                className="hidden overflow-hidden rounded-xl border border-border/60 shadow-sm md:block"
                dir={isRTL ? "rtl" : "ltr"}
              >
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className={isRTL ? "text-right" : "text-left"}>
                        {t("settings.detail.staff.employees.table.name")}
                      </TableHead>
                      <TableHead className={isRTL ? "text-right" : "text-left"}>
                        {t("settings.detail.staff.employees.table.device")}
                      </TableHead>
                      <TableHead className={isRTL ? "text-right" : "text-left"}>
                        {t("settings.detail.staff.employees.table.status")}
                      </TableHead>
                      <TableHead className={isRTL ? "text-right" : "text-left"}>
                        {t("common.actions")}
                      </TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {employees.map((employee) => (
                      <TableRow key={employee.name}>
                        <TableCell className="font-medium">
                          {employee.name}
                        </TableCell>
                        <TableCell>{employee.device}</TableCell>
                        <TableCell>
                          <Badge
                            className={`${statusClasses[employee.status] ?? ""}`}
                          >
                            {t(
                              `settings.detail.staff.employees.status.${employee.status}`
                            )}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => handleEditEmployee(employee)}
                            className="flex items-center gap-1"
                          >
                            <PenSquare className="h-4 w-4" />
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </div>
          </CardContent>
        </Card>
      </TabsContent>

      <TabsContent value="roles" className="space-y-6">
        <Card className="border-border/60 bg-background/60 shadow-sm">
          <CardHeader className={isRTL ? "text-right" : "text-left"}>
            <CardTitle>{t("settings.detail.staff.roles.title")}</CardTitle>
            <CardDescription>
              {t("settings.detail.staff.roles.description")}
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div
              className={`flex flex-col gap-4 md:flex-row md:items-center md:justify-between ${
                isRTL ? "md:flex-row-reverse" : ""
              }`}
            >
              <div className={isRTL ? "text-right" : "text-left"}>
                <h3 className="text-base font-semibold text-foreground">
                  {t("settings.detail.staff.roles.subtitle")}
                </h3>
                <p className="text-sm text-muted-foreground">
                  {t("settings.detail.staff.roles.helper")}
                </p>
              </div>
              <Button className="self-start md:self-auto">
                {t("settings.detail.staff.roles.create")}
              </Button>
            </div>

            <div className="space-y-4">
              <div className="space-y-3 md:hidden">
                {roles.map((role) => (
                  <Card key={role.name} className="border border-border/60 shadow-sm">
                    <CardContent className="space-y-3 py-4 text-sm">
                      <div
                        className={`flex items-center justify-between ${
                          isRTL ? "flex-row-reverse" : ""
                        }`}
                      >
                        <span className="font-medium text-foreground">
                          {role.name}
                        </span>
                        <Badge className="bg-primary/10 text-primary">
                          {role.type}
                        </Badge>
                      </div>
                      <div
                        className={`flex items-center justify-between text-sm text-muted-foreground ${isRTL ? "flex-row-reverse" : ""}`}
                      >
                        <span>{t("settings.detail.staff.roles.table.members")}</span>
                        <span className="font-medium text-foreground">{role.members}</span>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>

              <div
                className="hidden overflow-hidden rounded-xl border border-border/60 shadow-sm md:block"
                dir={isRTL ? "rtl" : "ltr"}
              >
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className={isRTL ? "text-right" : "text-left"}>
                        {t("settings.detail.staff.roles.table.name")}
                      </TableHead>
                      <TableHead className={isRTL ? "text-right" : "text-left"}>
                        {t("settings.detail.staff.roles.table.type")}
                      </TableHead>
                      <TableHead className={isRTL ? "text-right" : "text-left"}>
                        {t("settings.detail.staff.roles.table.members")}
                      </TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {roles.map((role) => (
                      <TableRow key={role.name}>
                        <TableCell className="font-medium">{role.name}</TableCell>
                        <TableCell>{role.type}</TableCell>
                        <TableCell>{role.members}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </div>
          </CardContent>
        </Card>
      </TabsContent>
    </Tabs>
  )
}
