
import { Document, Page, Text, View, StyleSheet } from '@react-pdf/renderer';

const styles = StyleSheet.create({
  page: {
    padding: 30,
    fontFamily: 'Helvetica',
  },
  section: {
    marginBottom: 20,
    borderBottom: '1pt solid #EEEEEE',
    paddingBottom: 10,
  },
  heading: {
    fontSize: 16,
    marginBottom: 10,
    color: '#C84E00',
    fontWeight: 'bold',
  },
  subHeading: {
    fontSize: 14,
    marginBottom: 8,
    fontWeight: 'bold',
  },
  text: {
    fontSize: 10,
    marginBottom: 5,
    lineHeight: 1.5,
  },
  bold: {
    fontWeight: 'bold',
  },
  row: {
    flexDirection: 'row',
    marginBottom: 5,
  },
  label: {
    width: '30%',
    fontSize: 10,
    fontWeight: 'bold',
  },
  value: {
    width: '70%',
    fontSize: 10,
  },
  footer: {
    position: 'absolute',
    bottom: 30,
    left: 30,
    right: 30,
    textAlign: 'center',
    fontSize: 8,
    color: '#666666',
  },
  pageNumber: {
    position: 'absolute',
    bottom: 30,
    right: 30,
    fontSize: 8,
    color: '#666666',
  }
});

export const ApplicationPDF = ({ applicant, education, employment, references, verification }) => (
  <Document>
    <Page size="A4" style={styles.page}>
      <View style={styles.section}>
        <Text style={styles.heading}>SWIIS Application Form</Text>
        <Text style={styles.text}>Application Reference Number: {applicant?.id || 'N/A'}</Text>
        <Text style={styles.text}>Date Generated: {new Date().toLocaleDateString()}</Text>
      </View>

      {/* PERSONAL INFORMATION */}
      <View style={styles.section}>
        <Text style={styles.heading}>1. Personal Information</Text>
        <View style={styles.row}>
          <Text style={styles.label}>Full Name:</Text>
          <Text style={styles.value}>{applicant?.title || ''} {applicant?.firstName || ''} {applicant?.middleName || ''} {applicant?.lastName || ''}</Text>
        </View>
        <View style={styles.row}>
          <Text style={styles.label}>Date of Birth:</Text>
          <Text style={styles.value}>{applicant?.dateOfBirth || 'Not provided'}</Text>
        </View>
        <View style={styles.row}>
          <Text style={styles.label}>Email:</Text>
          <Text style={styles.value}>{applicant?.email || 'Not provided'}</Text>
        </View>
        <View style={styles.row}>
          <Text style={styles.label}>Phone:</Text>
          <Text style={styles.value}>{applicant?.phone || 'Not provided'}</Text>
        </View>
        <View style={styles.row}>
          <Text style={styles.label}>Address:</Text>
          <Text style={styles.value}>{applicant?.address || 'Not provided'}</Text>
        </View>
        <View style={styles.row}>
          <Text style={styles.label}>City:</Text>
          <Text style={styles.value}>{applicant?.city || 'Not provided'}</Text>
        </View>
        <View style={styles.row}>
          <Text style={styles.label}>Postcode:</Text>
          <Text style={styles.value}>{applicant?.postcode || 'Not provided'}</Text>
        </View>
        <View style={styles.row}>
          <Text style={styles.label}>National Insurance:</Text>
          <Text style={styles.value}>{applicant?.nationalInsurance || 'Not provided'}</Text>
        </View>
      </View>

      {/* EDUCATION HISTORY */}
      <View style={styles.section}>
        <Text style={styles.heading}>2. Education History</Text>
        {education && education.length > 0 ? (
          education.map((entry, i) => (
            <View key={i} style={{ marginBottom: 10 }}>
              <Text style={styles.subHeading}>{entry.institution || 'Institution not specified'}</Text>
              <View style={styles.row}>
                <Text style={styles.label}>Qualification:</Text>
                <Text style={styles.value}>{entry.qualification || 'Not provided'}</Text>
              </View>
              <View style={styles.row}>
                <Text style={styles.label}>Start Date:</Text>
                <Text style={styles.value}>{entry.startDate || 'Not provided'}</Text>
              </View>
              <View style={styles.row}>
                <Text style={styles.label}>End Date:</Text>
                <Text style={styles.value}>{entry.endDate || 'Not provided'}</Text>
              </View>
              <View style={styles.row}>
                <Text style={styles.label}>Description:</Text>
                <Text style={styles.value}>{entry.description || 'Not provided'}</Text>
              </View>
            </View>
          ))
        ) : (
          <Text style={styles.text}>No education history provided</Text>
        )}
      </View>
      
      <Text style={styles.pageNumber} render={({ pageNumber, totalPages }) => (
        `Page ${pageNumber} of ${totalPages}`
      )} fixed />
    </Page>

    {/* EMPLOYMENT HISTORY PAGE */}
    <Page size="A4" style={styles.page}>
      <View style={styles.section}>
        <Text style={styles.heading}>3. Employment History</Text>
        {employment && employment.length > 0 ? (
          employment.map((entry, i) => (
            <View key={i} style={{ marginBottom: 15 }}>
              <Text style={styles.subHeading}>{entry.employer || 'Employer not specified'}</Text>
              <View style={styles.row}>
                <Text style={styles.label}>Position:</Text>
                <Text style={styles.value}>{entry.position || 'Not provided'}</Text>
              </View>
              <View style={styles.row}>
                <Text style={styles.label}>Address:</Text>
                <Text style={styles.value}>{entry.employerAddress || 'Not provided'}</Text>
              </View>
              <View style={styles.row}>
                <Text style={styles.label}>Postcode:</Text>
                <Text style={styles.value}>{entry.employerPostcode || 'Not provided'}</Text>
              </View>
              <View style={styles.row}>
                <Text style={styles.label}>Phone:</Text>
                <Text style={styles.value}>{entry.employerPhone || 'Not provided'}</Text>
              </View>
              <View style={styles.row}>
                <Text style={styles.label}>Mobile:</Text>
                <Text style={styles.value}>{entry.employerMobile || 'Not provided'}</Text>
              </View>
              <View style={styles.row}>
                <Text style={styles.label}>Start Date:</Text>
                <Text style={styles.value}>{entry.startDate || 'Not provided'}</Text>
              </View>
              <View style={styles.row}>
                <Text style={styles.label}>End Date:</Text>
                <Text style={styles.value}>{entry.endDate || (entry.isCurrent ? 'Present' : 'Not provided')}</Text>
              </View>
              <View style={styles.row}>
                <Text style={styles.label}>Duties:</Text>
                <Text style={styles.value}>{entry.duties || 'Not provided'}</Text>
              </View>
              <View style={styles.row}>
                <Text style={styles.label}>Reason for Leaving:</Text>
                <Text style={styles.value}>{entry.reasonForLeaving || (entry.isCurrent ? 'N/A - Current employer' : 'Not provided')}</Text>
              </View>
              <View style={styles.row}>
                <Text style={styles.label}>Worked with vulnerable:</Text>
                <Text style={styles.value}>{entry.workedWithVulnerable ? 'Yes' : 'No'}</Text>
              </View>
              <View style={styles.row}>
                <Text style={styles.label}>Reference Contact:</Text>
                <Text style={styles.value}>{entry.referenceName || 'Not provided'}</Text>
              </View>
              <View style={styles.row}>
                <Text style={styles.label}>Reference Email:</Text>
                <Text style={styles.value}>{entry.referenceEmail || 'Not provided'}</Text>
              </View>
              <View style={styles.row}>
                <Text style={styles.label}>Reference Phone:</Text>
                <Text style={styles.value}>{entry.referencePhone || 'Not provided'}</Text>
              </View>
            </View>
          ))
        ) : (
          <Text style={styles.text}>No employment history provided</Text>
        )}
      </View>
      
      <Text style={styles.pageNumber} render={({ pageNumber, totalPages }) => (
        `Page ${pageNumber} of ${totalPages}`
      )} fixed />
    </Page>

    {/* REFERENCES AND VERIFICATION PAGE */}
    <Page size="A4" style={styles.page}>
      <View style={styles.section}>
        <Text style={styles.heading}>4. References</Text>
        {references && references.length > 0 ? (
          references.map((ref, i) => (
            <View key={i} style={{ marginBottom: 10 }}>
              <Text style={styles.subHeading}>Reference {i + 1}</Text>
              <View style={styles.row}>
                <Text style={styles.label}>Name:</Text>
                <Text style={styles.value}>{ref.name || 'Not provided'}</Text>
              </View>
              <View style={styles.row}>
                <Text style={styles.label}>Email:</Text>
                <Text style={styles.value}>{ref.email || 'Not provided'}</Text>
              </View>
              <View style={styles.row}>
                <Text style={styles.label}>Phone:</Text>
                <Text style={styles.value}>{ref.phone || 'Not provided'}</Text>
              </View>
              <View style={styles.row}>
                <Text style={styles.label}>Status:</Text>
                <Text style={styles.value}>
                  {ref.referenceRequested ? 'Requested' : 'Not requested'}
                  {ref.referenceReceived ? ', Received' : ''}
                  {ref.referenceVerified ? ', Verified' : ''}
                </Text>
              </View>
            </View>
          ))
        ) : (
          <Text style={styles.text}>No references provided</Text>
        )}
      </View>

      <View style={styles.section}>
        <Text style={styles.heading}>5. Verification & Checks</Text>
        <View style={styles.row}>
          <Text style={styles.label}>DBS Check:</Text>
          <Text style={styles.value}>{verification?.existingDbs ? 'Has existing DBS' : 'No existing DBS'}</Text>
        </View>
        <View style={styles.row}>
          <Text style={styles.label}>DBS Number:</Text>
          <Text style={styles.value}>{verification?.dbsNumber || 'Not provided'}</Text>
        </View>
        <View style={styles.row}>
          <Text style={styles.label}>DBS Issue Date:</Text>
          <Text style={styles.value}>{verification?.dbsIssueDate || 'Not provided'}</Text>
        </View>
        <View style={styles.row}>
          <Text style={styles.label}>DBS Update Service:</Text>
          <Text style={styles.value}>{verification?.dbsUpdateService ? 'Yes' : 'No'}</Text>
        </View>
        <View style={styles.row}>
          <Text style={styles.label}>Right to Work:</Text>
          <Text style={styles.value}>{applicant?.rightToWork ? 'Yes' : 'No'}</Text>
        </View>
        <View style={styles.row}>
          <Text style={styles.label}>Work Document Type:</Text>
          <Text style={styles.value}>{applicant?.workDocumentType || 'Not provided'}</Text>
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.heading}>6. Equal Opportunities Information</Text>
        <View style={styles.row}>
          <Text style={styles.label}>Gender:</Text>
          <Text style={styles.value}>{applicant?.gender || 'Not provided'}</Text>
        </View>
        <View style={styles.row}>
          <Text style={styles.label}>Ethnicity:</Text>
          <Text style={styles.value}>{applicant?.ethnicity || 'Not provided'}</Text>
        </View>
        <View style={styles.row}>
          <Text style={styles.label}>Disability:</Text>
          <Text style={styles.value}>{applicant?.disability ? 'Yes' : 'No'}</Text>
        </View>
        {applicant?.disability && (
          <View style={styles.row}>
            <Text style={styles.label}>Disability Details:</Text>
            <Text style={styles.value}>{applicant?.disabilityDetails || 'No details provided'}</Text>
          </View>
        )}
      </View>

      <View style={styles.section}>
        <Text style={styles.heading}>7. Disciplinary & Criminal Issues</Text>
        <View style={styles.row}>
          <Text style={styles.label}>Disciplinary Issues:</Text>
          <Text style={styles.value}>{applicant?.disciplinaryIssues ? 'Yes' : 'No'}</Text>
        </View>
        {applicant?.disciplinaryIssues && (
          <View style={styles.row}>
            <Text style={styles.label}>Disciplinary Details:</Text>
            <Text style={styles.value}>{applicant?.disciplinaryDetails || 'No details provided'}</Text>
          </View>
        )}
        <View style={styles.row}>
          <Text style={styles.label}>Criminal Convictions:</Text>
          <Text style={styles.value}>{applicant?.criminalConvictions ? 'Yes' : 'No'}</Text>
        </View>
        {applicant?.criminalConvictions && (
          <View style={styles.row}>
            <Text style={styles.label}>Conviction Details:</Text>
            <Text style={styles.value}>{applicant?.convictionDetails || 'No details provided'}</Text>
          </View>
        )}
      </View>

      <View style={styles.footer}>
        <Text>Swiis Foster Care - Application Form</Text>
        <Text>Confidential document - Generated on {new Date().toLocaleDateString()}</Text>
      </View>
      
      <Text style={styles.pageNumber} render={({ pageNumber, totalPages }) => (
        `Page ${pageNumber} of ${totalPages}`
      )} fixed />
    </Page>
  </Document>
);
