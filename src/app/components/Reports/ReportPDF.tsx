import { Document, Page, Text, View, StyleSheet, Image as PDFImage, Font, BlobProvider } from '@react-pdf/renderer';
import { useEffect } from 'react';
import logoImage from '../../../../public/logo/s-logo.png';
import signature1 from '../../../../public/signatures/signature1.png';
import signature2 from '../../../../public/signatures/signature2.png';

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
  report?: {
    findings: string;
    impression: string;
  };
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
    fontSize: 10,
  },
  header: { 
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'center',
    marginBottom: 20,
  },
  logo: {
    width: 346,
    height: 80,
  },
  title: {
    backgroundColor: '#31569B',
    padding: 10,
    color: 'white',
    fontWeight: 'bold',
    fontSize: 16,
    marginLeft: 40, // Add this line to create space between logo and title
  },
  infoContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: 20,
  },
  infoColumn: {
    width: '70%',
  },
  rightColumn: {
    width: '30%',
  },
  infoItem: {
    marginBottom: 5,
  },
  label: {
    fontWeight: 'bold',
  },
  radiologyTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 10,
    textAlign: 'center',
  },
  sectionTitle: {
    fontSize: 12,
    fontWeight: 'bold',
    marginBottom: 5,
    marginTop: 10,
  },
  contentArea: {
    border: 1,
    borderColor: '#000',
    padding: 5,
    minHeight: 100,
    marginBottom: 10,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 'auto',
    paddingTop: 20,
    paddingBottom: 30,
  },
  signatureArea: {
    width: '45%',
    borderTop: 1,
    borderColor: '#000',
    paddingTop: 5,
    fontSize: 8,
    textAlign: 'center',
    marginTop: 10,
    position: 'relative', // Add this line
  },
  signatureImage: {
    width: 130,
    height: 130,
    marginBottom: 5,
    position: 'absolute', // Add this line
    top: -70, // Adjust this value as needed to position the signature above the name
    left: '40%',
    transform: 'translateX(-50%)',
  },
  contentWrapper: {
    flex: 1,
  },
});

export default function ReportPDF({ patient }: Props) {
  const MyDocument = (
    <Document>
      <Page style={styles.page}>
        <View style={styles.contentWrapper}>
          <View style={styles.header}>
            <PDFImage src={logoImage.src} style={styles.logo} />
            <Text style={styles.title}>X-RAY REPORT</Text>
          </View>

          <View style={styles.infoContainer}>
            <View style={styles.infoColumn}>
              <View style={styles.infoItem}>
                <Text>
                  <Text style={styles.label}>NAME: </Text>
                  {patient.name}
                </Text>
              </View>
              <View style={styles.infoItem}>
                <Text>
                  <Text style={styles.label}>ADDRESS: </Text>
                  {patient.address}
                </Text>
              </View>
              <View style={styles.infoItem}>
                <Text>
                  <Text style={styles.label}>BIRTHDATE: </Text>
                  {new Date(patient.birthday).toLocaleDateString()}
                </Text>
              </View>
              <View style={styles.infoItem}>
                <Text>
                  <Text style={styles.label}>REQUESTED BY: </Text>
                  {patient.requestedBy}
                </Text>
              </View>
              <View style={styles.infoItem}>
                <Text>
                  <Text style={styles.label}>EXAMINATION: </Text>
                  {patient.examinationDone}
                </Text>
              </View>
            </View>
            <View style={styles.rightColumn}>
              <View style={styles.infoItem}>
                <Text>
                  <Text style={styles.label}>DATE PERFORMED: </Text>
                  {new Date(patient.datePerformed).toLocaleDateString()}
                </Text>
              </View>
              <View style={styles.infoItem}>
                <Text>
                  <Text style={styles.label}>CASE NO.: </Text>
                  {patient.caseNo}
                </Text>
              </View>
              <View style={styles.infoItem}>
                <Text>
                  <Text style={styles.label}>AGE: </Text>
                  {patient.age}
                </Text>
              </View>
              <View style={styles.infoItem}>
                <Text>
                  <Text style={styles.label}>SEX: </Text>
                  {patient.sex}
                </Text>
              </View>
            </View>
          </View>

          <Text style={styles.radiologyTitle}>RADIOLOGY</Text>

          <Text style={styles.sectionTitle}>RADIOLOGICAL FINDINGS</Text>
          <View style={styles.contentArea}>
            <Text>{patient.report?.findings || 'N/A'}</Text>
          </View>

          <Text style={styles.sectionTitle}>IMPRESSION</Text>
          <View style={styles.contentArea}>
            <Text>{patient.report?.impression || 'N/A'}</Text>
          </View>
        </View>

        <View style={styles.footer}>
          <View style={styles.signatureArea}>
            <PDFImage src={signature1.src} style={styles.signatureImage} />
            <Text>JOSEPH CORONEL, RRT</Text>
            <Text>RADIOLOGIC TECHNOLOGIST</Text>
          </View>
          <View style={styles.signatureArea}>
            <PDFImage src={signature2.src} style={styles.signatureImage} />
            <Text>OMAR N. BRAGA, MD, DPBR</Text>
            <Text>RADIOLOGIST</Text>
          </View>
        </View>
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
        if (error) return <div>Error: {error.message}</div>;
        return null;
      }}
    </BlobProvider>
  );
}