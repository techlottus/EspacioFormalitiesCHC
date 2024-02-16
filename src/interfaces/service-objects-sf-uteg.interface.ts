export interface CommonServiceFields_UTEG {
  Nombre_de_la_cuenta__c: string;
  Email_en_RFI__c: string;
  Matricula__c: string;
  Nivel_Banner__c: string;
  Campus_Banner__c: string;
  Programa_ONLINE_Banner__c: string;
  Numero_de_telefono__c: string;
  Acepto_el_Cargo__c: boolean;
  Comentarios__c: string | null;
  Status__c: string;
  Asignar_mediante_las_reglas__c: boolean;
  Forma_de_Entrega__c?: string;
  Selecciona_Campus__c?: string;
}

export interface PhotostaticCopyOfDocument_UTEG
  extends CommonServiceFields_UTEG {
  Tipo_de_Documento__c?: string;
}

export interface DocumentLoan_UTEG extends CommonServiceFields_UTEG {
  Nombre_del_documento__c?: string;
}

export interface ProofOfStudyServiceFieldsUteg
  extends CommonServiceFields_UTEG {
  Constancia_UTEG__c: string;
}

export interface CertificateServiceFields_UTEG
  extends CommonServiceFields_UTEG {
  UTEG_Tipo_de_Certificado__c: string;
}
