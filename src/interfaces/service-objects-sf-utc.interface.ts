export interface CommonServiceFields_UTC {
  Nombre_de_la_cuenta__c: string,
  Correo_Institucional_UTC__c: string,
  Matricula__c: string,
  Numero_de_telefono__c: string,
  Modalidad_UTC__c: string,
  Nivel_UTC__c: string,
  Campus_UTC__c: string,
  Programa_UTC__c: string,
  Tipo_de_Entrega_UTC__c?: string,
  Selecciona_Campus_UTC__c?: string,
  Acepto_el_Cargo__c: boolean,
  Comentarios__c?: string | null,
  Etapa_UTC__c: string,
  Asignar_mediante_las_reglas__c: boolean
}

export interface ProofofStudyServiceFields_UTC
  extends CommonServiceFields_UTC {
  Tipo_de_Constancia_UTC__c: string,
  Dirigir_a_SEDENA__c: boolean,
}

export interface StudyCertificateServiceFields_UTC
  extends CommonServiceFields_UTC {
  Tipo_de_Certificado__c: string,
  Tipo_de_Solicitud_de_Certificado_UTC__c?: string
}
