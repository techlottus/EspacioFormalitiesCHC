import {getProofOfStudyStatusOk} from '../../../constants';
import {DetailCodes, ProcedureWithCost, ProofOfStudy, ProofOfStudyModal, SSCHCResponse} from '../../../models';
import {campusArray, deliveryArray} from '../../mocks/common.mocks';

export const proofOfStudyArray = [
  new ProofOfStudy({
    "label": "100 por ciento Créditos",
    "value": "7822016873847983"
  }),
  new ProofOfStudy({
    "label": "SEDENA",
    "value": '836968697865'
  })
];

export const dcPosArray = [
  new DetailCodes({
    "description": "CONSTANCIA DE ESTUDIOS",
    "identifiers": ['7822016873847983', '836968697865', '7679656784856576', '687180'],
    "detailCode": "1204",
    "levels": [
      "LI",
      "LE",
      "LJ",
      "LO",
      "MA",
      "MO",
      "ES",
      "PO",
      "BA",
      "DR",
      "EC",
      "EX",
      "TC"
    ]
  }),
  new DetailCodes({
    "description": "CONSTANCIA CON PROMEDIO CETC",
    "identifiers": ['8082797769687379'],
    "detailCode": "1111",
    "levels": [
      "LI",
      "LE",
      "LJ",
      "LO",
      "MA",
      "MO",
      "ES",
      "PO"
    ]
  }),
  new DetailCodes({
    "description": "CONSTANCIA CON PROMEDIO UTC",
    "identifiers": ['8082797769687379'],
    "detailCode": "1239",
    "levels": [
      "BA"
    ]
  })
];

export const costsBachArray = [
  {codeDetail: '1204', cost: 420},
  {codeDetail: '1239', cost: 515}
];

export const costsLicArray = [
  {codeDetail: '1204', cost: 420},
  {codeDetail: '1111', cost: 666}
];

export const posWithCostsArray = [
  new ProcedureWithCost({
    "label": "100 por ciento Créditos",
    "value": '7822016873847983',
    "detailId": "1204",
    "cost": 420
  }),
  new ProcedureWithCost({
    "label": "SEDENA",
    "value": '836968697865',
    "detailId": "1204",
    "cost": 420
  })
]

export const modalArray = [
  new ProofOfStudyModal({
    label: '100% Créditos',
    value: '100creditos',
    description: 'constancia 100% créditos',
    imageUrl: 'www.imagen.com'
  }),

  new ProofOfStudyModal({
    label: '100% Créditos',
    value: '100creditos',
    description: 'constancia 100% créditos',
    imageUrl: 'www.imagen.com'
  }),
];

export const proofOfStudyResponse = new SSCHCResponse()
proofOfStudyResponse.data = {
  proofOfStudies: posWithCostsArray,
  delivery: deliveryArray,
  campus: campusArray,
  modal: modalArray
};
proofOfStudyResponse.status = {
  id: 200,
  info: getProofOfStudyStatusOk
};
