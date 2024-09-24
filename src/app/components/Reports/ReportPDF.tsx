import { Document, Page, Text, View, StyleSheet, Image as PDFImage, Font, BlobProvider } from '@react-pdf/renderer';
import { useEffect } from 'react';

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

// Register custom fonts
Font.register({
  family: 'Roboto',
  fonts: [
    { src: 'https://cdnjs.cloudflare.com/ajax/libs/ink/3.1.10/fonts/Roboto/roboto-light-webfont.ttf', fontWeight: 300 },
    { src: 'https://cdnjs.cloudflare.com/ajax/libs/ink/3.1.10/fonts/Roboto/roboto-regular-webfont.ttf', fontWeight: 400 },
    { src: 'https://cdnjs.cloudflare.com/ajax/libs/ink/3.1.10/fonts/Roboto/roboto-medium-webfont.ttf', fontWeight: 500 },
    { src: 'https://cdnjs.cloudflare.com/ajax/libs/ink/3.1.10/fonts/Roboto/roboto-bold-webfont.ttf', fontWeight: 700 },
  ],
});

const styles = StyleSheet.create({
  page: { 
    padding: 30,
    fontFamily: 'Roboto',
    fontSize: 12,
  },
  header: { 
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
    borderBottom: 1,
    paddingBottom: 10,
  },
  headerText: {
    fontSize: 24,
    fontWeight: 700,
    color: '#333333',
  },
  logo: {
    width: 100,
    height: 50,
  },
  section: { 
    marginBottom: 10,
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: 700,
    marginBottom: 5,
    color: '#555555',
  },
  patientInfo: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  infoItem: {
    width: '50%',
    marginBottom: 5,
  },
  label: {
    fontWeight: 500,
    marginRight: 5,
  },
  image: { 
    // Remove this style as it's no longer needed
  },
  reportSection: {
    marginTop: 20,
  },
  footer: {
    position: 'absolute',
    bottom: 30,
    left: 30,
    right: 30,
    textAlign: 'center',
    color: '#555555',
    fontSize: 10,
  },
});

export default function ReportPDF({ patient }: Props) {
  const MyDocument = (
    <Document>
      <Page style={styles.page}>
        <View style={styles.header}>
          <Text style={styles.headerText}>X-Ray Report</Text>
          <PDFImage src="/path-to-your-logo.png" style={styles.logo} />
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Patient Information</Text>
          <View style={styles.patientInfo}>
            <View style={styles.infoItem}>
              <Text>
                <Text style={styles.label}>Name:</Text> {patient.name}
              </Text>
            </View>
            <View style={styles.infoItem}>
              <Text>
                <Text style={styles.label}>Case No:</Text> {patient.caseNo}
              </Text>
            </View>
            <View style={styles.infoItem}>
              <Text>
                <Text style={styles.label}>Sex:</Text> {patient.sex}
              </Text>
            </View>
            <View style={styles.infoItem}>
              <Text>
                <Text style={styles.label}>Age:</Text> {patient.age}
              </Text>
            </View>
            <View style={styles.infoItem}>
              <Text>
                <Text style={styles.label}>Date of Birth:</Text> {new Date(patient.birthday).toLocaleDateString()}
              </Text>
            </View>
            <View style={styles.infoItem}>
              <Text>
                <Text style={styles.label}>Address:</Text> {patient.address}
              </Text>
            </View>
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Examination Details</Text>
          <View style={styles.patientInfo}>
            <View style={styles.infoItem}>
              <Text>
                <Text style={styles.label}>Examination:</Text> {patient.examinationDone}
              </Text>
            </View>
            <View style={styles.infoItem}>
              <Text>
                <Text style={styles.label}>Date Performed:</Text> {new Date(patient.datePerformed).toLocaleDateString()}
              </Text>
            </View>
            <View style={styles.infoItem}>
              <Text>
                <Text style={styles.label}>Requested By:</Text> {patient.requestedBy}
              </Text>
            </View>
          </View>
        </View>

        <View style={styles.reportSection}>
          <Text style={styles.sectionTitle}>Radiologist's Report</Text>
          <Text>Findings: {patient.report?.findings || 'N/A'}</Text>
          <Text>Impression: {patient.report?.impression || 'N/A'}</Text>
        </View>

        <Text style={styles.footer}>
          This report is {patient.validated ? 'validated' : 'not validated'} and confidential. 
          For medical professional use only.
        </Text>
      </Page>
    </Document>
  );

  return (
    <BlobProvider document={MyDocument}>
      {({ url, loading, error }) => {
        useEffect(() => {
          if (url) {
            window.open(url, '_blank');
          }
        }, [url]);

        if (loading) return <div>Loading document...</div>;
        if (error) return <div>Error: {error}</div>;
        return null;
      }}
    </BlobProvider>
  );
}