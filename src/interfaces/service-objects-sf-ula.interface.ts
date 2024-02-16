export interface CommonServiceFields_ULA {
  Matricula__c: string;
  Nombre_de_la_cuenta__c: string;
  Email_en_RFI__c: string;
  Numero_de_telefono__c: string;
  Campus_Banner__c: string;
  Programa_ONLINE_Banner__c: string;
  Acepto_el_Cargo__c: boolean;
  Comentarios__c: string | null;
  Nivel_Banner__c?: string;
  Status__c: string;
  Asignar_mediante_las_reglas__c: boolean;
  Forma_de_Entrega__c?: string;
  Selecciona_Campus__c?: string;
}

export interface SocialServiceProgramaULAServicioFields_ULA
  extends CommonServiceFields_ULA {
  Nombre_de_la_Institucion__c: string;
  Responsable_del_Programa__c: string;
  Cargo_del_responsable__c: string;
}

export interface ProofOfStudyOnline_ULA extends CommonServiceFields_ULA {
  Tipo_de_Constancia__c: string;
}

export interface ProofOfStudyTradicional_ULA extends CommonServiceFields_ULA {
  Tipo_de_Constancia_TRADICIONAL__c: string;
  Dirigir_a_SEDENA__c: boolean;
}

export interface StudyCertificate_ULA extends CommonServiceFields_ULA {
  Tipo_de_Certificado_TRADICIONAL__c: string;
  Tipo_de_Solicitud_de_Certificado_TRAD__c?: string;
}

export interface AdmissionCertificate_ULA extends CommonServiceFields_ULA {
  Pa_s_de_Nacimiento__c: string;
  Pa_s_de_Estudios_Inmediatos_Anteriores__c: string;
  Nombre_Escuela_de_Procedencia__c: string;
  Fecha_Inicio_Admision__c: string;
  Fecha_Fin_Admision__c: string;
}

export interface Scholarship_ULA extends CommonServiceFields_ULA {
  Tipo_de_Solicitud_de_Beca_TRAD__c?: string;
}
