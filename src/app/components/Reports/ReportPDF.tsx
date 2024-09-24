import { Document, Page, Text, StyleSheet, Image as PDFImage } from '@react-pdf/renderer';

interface Patient {
  name: string;
  address: string;
  requestedBy: string;
  examinationDone: string;
  caseNo: string;
  datePerformed: string;
  sex: string;
  birthday: string;
  age: number;
  xrayImage: string;
  report?: string;
  validated: boolean;
}

interface Props {
  patient: Patient;
}

const styles = StyleSheet.create({
  page: { padding: 30 },
  section: { marginBottom: 10 },
  header: { fontSize: 20, marginBottom: 10 },
  image: { width: 200, height: 200 },
});

export default function ReportPDF({ patient }: Props) {
  return (
    <Document>
      <Page style={styles.page}>
        <Text style={styles.header}>Radiology Report</Text>
        <Text style={styles.section}>Name: {patient.name}</Text>
        <Text style={styles.section}>Address: {patient.address}</Text>
        <Text style={styles.section}>Requested By: {patient.requestedBy}</Text>
        <Text style={styles.section}>Examination Done: {patient.examinationDone}</Text>
        <Text style={styles.section}>Case No: {patient.caseNo}</Text>
        <Text style={styles.section}>
          Date Performed: {new Date(patient.datePerformed).toLocaleDateString()}
        </Text>
        <Text style={styles.section}>Sex: {patient.sex}</Text>
        <Text style={styles.section}>
          Birthday: {new Date(patient.birthday).toLocaleDateString()}
        </Text>
        <Text style={styles.section}>Age: {patient.age}</Text>
        <PDFImage src={patient.xrayImage} style={styles.image} />
        <Text style={styles.section}>Report:</Text>
        <Text style={styles.section}>{patient.report}</Text>
      </Page>
    </Document>
  );
}