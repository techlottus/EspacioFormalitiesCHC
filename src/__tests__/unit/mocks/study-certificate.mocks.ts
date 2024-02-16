import {getStudyCertificateStatusOk} from '../../../constants';
import {DetailCodes, ProcedureWithCost, SSCHCResponse, StudyCertificate} from '../../../models';
import {campusArray, deliveryArray} from '../../mocks/common.mocks';

const studyCertParcial = {
  label: 'Certificado Parcial',
  value: '1',
};

const studyCertTotal = {
  label: 'Certificado Total',
  value: '2',
};

export const studyCertificateArray = [
  new StudyCertificate(studyCertParcial),
  new StudyCertificate(studyCertTotal)
];

export const totalStudyCertificateArray = [
  new StudyCertificate({
    label: 'Primera vez',
    value: "8"
  }),

  new StudyCertificate({
    label: 'Quinta Vez',
    value: '10008000'
  })
]

export const dcStudyCertBachMock = [
  new DetailCodes({
    "detailCode": "1116",
    "description": "CERTIFICADO PARCIAL BACH CETC",
    "campus": [
      "COACALCO",
      "TOLUCA"
    ],
    "identifier": '1'
  }),
  new DetailCodes({
    "detailCode": "1241",
    "description": "CERTIFICADO PARCIAL BACH UTC",
    "campus": [
      "HAVRE"
    ],
    "identifier": '1'
  }),
  new DetailCodes({
    "detailCode": "I251",
    "description": "CERTIFICADO PAGO IND BACH CETC",
    "campus": [
      "COACALCO",
      "TOLUCA"
    ],
    "identifier": '2'
  }),
  new DetailCodes({
    "detailCode": "251I",
    "description": "CERTIFICADO PAGO IND BACH UTC",
    "campus": [
      "HAVRE"
    ],
    "identifier": '2'
  })
];

export const dcStudyCertLicMock = [
  new DetailCodes({
    "detailCode": "1120",
    "description": "CERT PARCIAL LIC Y MA CETC",
    "levels": [
      "LI",
      "LE",
      "LJ",
      "LO",
      "MA",
      "MO"
    ],
    "identifier": '1'
  }),
  new DetailCodes({
    "detailCode": "I253",
    "description": "CERTIFICADO PAGO IND LIC CETC",
    "levels": [
      "LI",
      "LE",
      "LJ",
      "LO"
    ],
    "identifier": '2'
  }),
  new DetailCodes({
    "detailCode": "I255",
    "description": "CERTIFICADO PAGO IND MTR CETC",
    "levels": [
      "MA",
      "MO"
    ],
    "identifier": '2'
  })
];

export const costsArrayStudyCertBachCoacalcoArray = [
  {codeDetail: '1116', cost: 4000},
  {codeDetail: 'I251', cost: 5000}
];


export const costsArrayStudyCertBachHavreArray = [
  {codeDetail: '1241', cost: 4400},
  {codeDetail: '251I', cost: 5550}
];

export const costsArrayStudyCertLicArray = [
  {codeDetail: '1120', cost: 6660},
  {codeDetail: 'I253', cost: 7770}
];

export const costsArrayStudyCertMaArray = [
  {codeDetail: '1120', cost: 6660},
  {codeDetail: 'I255', cost: 8880}
];

const studyCertDeliveryCampus = {
  studyCertificateTotalType: totalStudyCertificateArray,
  delivery: deliveryArray,
  campus: campusArray
};

const getStatusOk = {
  id: 200,
  info: getStudyCertificateStatusOk
};

export const studyCertBaCoacalcoResponse = new SSCHCResponse();

studyCertBaCoacalcoResponse.data = {
  studyCertificateType: [

    new ProcedureWithCost({
      ...studyCertParcial,
      detailId: '1116',
      cost: 4000
    }),

    new ProcedureWithCost({
      ...studyCertTotal,
      detailId: 'I251',
      cost: 5000
    }),

  ],
  ...studyCertDeliveryCampus
};
studyCertBaCoacalcoResponse.status = getStatusOk

export const studyCertBaHavreResponse = new SSCHCResponse();

studyCertBaHavreResponse.data = {
  studyCertificateType: [
    new ProcedureWithCost({
      ...studyCertParcial,
      detailId: '1241',
      cost: 4400
    }),

    new ProcedureWithCost({
      ...studyCertTotal,
      detailId: '251I',
      cost: 5550
    }),

  ],
  ...studyCertDeliveryCampus
};
studyCertBaHavreResponse.status = getStatusOk;

export const studyCertLiResponse = new SSCHCResponse();

studyCertLiResponse.data = {
  studyCertificateType: [
    new ProcedureWithCost({
      ...studyCertParcial,
      detailId: '1120',
      cost: 6660
    }),

    new ProcedureWithCost({
      ...studyCertTotal,
      detailId: 'I253',
      cost: 7770
    })
  ],
  ...studyCertDeliveryCampus
};
studyCertLiResponse.status = getStatusOk;

export const studyCertMaResponse = new SSCHCResponse();

studyCertMaResponse.data = {
  studyCertificateType: [
    new ProcedureWithCost({
      ...studyCertParcial,
      detailId: '1120',
      cost: 6660
    }),

    new ProcedureWithCost({
      ...studyCertTotal,
      detailId: 'I255',
      cost: 8880
    })
  ],
  ...studyCertDeliveryCampus
};
studyCertMaResponse.status = getStatusOk;
