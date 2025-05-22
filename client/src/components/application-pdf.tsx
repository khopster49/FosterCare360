
import { Document, Page, Text, View, StyleSheet, PDFViewer } from '@react-pdf/renderer';

const styles = StyleSheet.create({
  page: {
    padding: 30,
  },
  section: {
    marginBottom: 20,
  },
  heading: {
    fontSize: 16,
    marginBottom: 10,
    color: '#C84E00',
  },
  subHeading: {
    fontSize: 14,
    marginBottom: 8,
  },
  text: {
    fontSize: 12,
    marginBottom: 5,
  }
});

export const ApplicationPDF = ({ applicant, education, employment, references, verification }) => (
  <Document>
    <Page size="A4" style={styles.page}>
      <View style={styles.section}>
        <Text style={styles.heading}>SWIIS Foster Care Application Form</Text>
        <Text style={styles.text}>Application ID: {applicant.id}</Text>
        <Text style={styles.text}>Date: {new Date().toLocaleDateString()}</Text>
      </View>

      <View style={styles.section}>
        <Text style={styles.heading}>Personal Information</Text>
        <Text style={styles.text}>Name: {applicant.firstName} {applicant.middleName} {applicant.lastName}</Text>
        <Text style={styles.text}>Email: {applicant.email}</Text>
        <Text style={styles.text}>Phone: {applicant.phone}</Text>
        <Text style={styles.text}>Address: {applicant.address}</Text>
        <Text style={styles.text}>City: {applicant.city}</Text>
        <Text style={styles.text}>Postcode: {applicant.postcode}</Text>
      </View>

      <View style={styles.section}>
        <Text style={styles.heading}>Education History</Text>
        {education.map((entry, i) => (
          <View key={i} style={styles.section}>
            <Text style={styles.subHeading}>{entry.institution}</Text>
            <Text style={styles.text}>Qualification: {entry.qualification}</Text>
            <Text style={styles.text}>Period: {entry.startDate} - {entry.endDate}</Text>
          </View>
        ))}
      </View>

      <View style={styles.section}>
        <Text style={styles.heading}>Employment History</Text>
        {employment.map((entry, i) => (
          <View key={i} style={styles.section}>
            <Text style={styles.subHeading}>{entry.employer}</Text>
            <Text style={styles.text}>Position: {entry.position}</Text>
            <Text style={styles.text}>Period: {entry.startDate} - {entry.endDate || 'Present'}</Text>
            <Text style={styles.text}>Duties: {entry.duties}</Text>
          </View>
        ))}
      </View>

      <View style={styles.section}>
        <Text style={styles.heading}>References</Text>
        {references.map((ref, i) => (
          <View key={i} style={styles.section}>
            <Text style={styles.text}>Name: {ref.name}</Text>
            <Text style={styles.text}>Position: {ref.position}</Text>
            <Text style={styles.text}>Contact: {ref.email}, {ref.phone}</Text>
          </View>
        ))}
      </View>

      <View style={styles.section}>
        <Text style={styles.heading}>Verification</Text>
        <Text style={styles.text}>DBS Check Status: {verification.status}</Text>
        <Text style={styles.text}>Right to Work: {applicant.rightToWork ? 'Yes' : 'No'}</Text>
        <Text style={styles.text}>Document Type: {applicant.workDocumentType}</Text>
      </View>
    </Page>
  </Document>
);
