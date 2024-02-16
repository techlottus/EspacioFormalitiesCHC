import {Campus, Delivery} from '../../models'

export const serviceId = process.env.SERVICE_ID!
export const serviceName = process.env.SERVICE_NAME!
export const authHeader = 'Bearer 12386tdsfyodfsdf'

export const deliveryArray = [
  new Delivery({
    label: "Documento físico",
    value: '1'
  }),
  new Delivery({
    label: "Formato Digital",
    value: '2'
  })
]

export const campusArray = [
  new Campus({
    label: 'Jalisco',
    value: '4'
  }),
  new Campus({
    label: 'New Jersey',
    value: '9'
  })
]

export const studentDataBachCoacalcoMock = {
  name: "",
  email: "",
  enrollmentNumber: "",
  campus: "plantel coacalco",
  phoneNumber: "",
  level: "",
  levelCode: "BA",
  program: "",
  modality: "",
  studentId: "",
  periodCode: "",
};

export const studentDataBachHavreMock = {
  name: "",
  email: "",
  enrollmentNumber: "",
  campus: "plantel havre",
  phoneNumber: "",
  level: "",
  levelCode: "BA",
  program: "",
  modality: "",
  studentId: "",
  periodCode: "",
};

export const studentDataLicMock = {
  name: "",
  email: "",
  enrollmentNumber: "",
  campus: "",
  phoneNumber: "",
  level: "",
  levelCode: "LI",
  program: "",
  modality: "",
  studentId: "",
  periodCode: "",
};

export const studentDataMaMock = {
  name: "",
  email: "",
  enrollmentNumber: "",
  campus: "",
  phoneNumber: "",
  level: "",
  levelCode: "MA",
  program: "",
  modality: "",
  studentId: "",
  periodCode: "",
};
