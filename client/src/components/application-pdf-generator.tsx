import React from 'react';
import { Document, Page, Text, View, StyleSheet, PDFDownloadLink } from '@react-pdf/renderer';
import { Button } from '@/components/ui/button';
import { FileDown } from 'lucide-react';

// Create styles
const styles = StyleSheet.create({
  page: {
    fontFamily: 'Helvetica',
    fontSize: 12,
    paddingTop: 30,
    paddingBottom: 50,
    paddingHorizontal: 35,
  },
  title: {
    fontSize: 24,
    textAlign: 'center',
    marginBottom: 30,
    color: '#f26522',
    fontWeight: 'bold',
  },
  subtitle: {
    fontSize: 18,
    marginTop: 20,
    marginBottom: 10,
    color: '#f26522',
    fontWeight: 'bold',
  },
  section: {
    marginBottom: 10,
  },
  fullSection: {
    marginBottom: 20,
    paddingBottom: 10,
    borderBottom: '1 solid #ddd',
  },
  label: {
    fontSize: 12,
    marginBottom: 5,
    fontWeight: 'bold',
  },
  value: {
    fontSize: 11,
    marginBottom: 10,
  },
  row: {
    flexDirection: 'row',
    marginBottom: 10,
  },
  col50: {
    width: '50%',
  },
  col33: {
    width: '33%',
  },
  col66: {
    width: '66%',
  },
  header: {
    fontSize: 14,
    marginBottom: 20,
    textAlign: 'center',
    color: 'grey',
  },
  footer: {
    position: 'absolute',
    bottom: 30,
    left: 0,
    right: 0,
    fontSize: 10,
    textAlign: 'center',
    color: 'grey',
  },
  reference: {
    border: '1px solid #ddd',
    padding: 10,
    marginBottom: 15,
    borderRadius: 5,
  },
  employmentEntry: {
    border: '1px solid #ddd',
    padding: 10,
    marginBottom: 15,
    borderRadius: 5,
  },
  checkbox: {
    height: 12,
    width: 12,
    marginRight: 5,
    border: '1px solid black',
    backgroundColor: '#fff',
  },
  checkedBox: {
    height: 12,
    width: 12,
    marginRight: 5,
    border: '1px solid black',
    backgroundColor: '#666',
  },
  checkLabel: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 5,
  },
  pageNumber: {
    position: 'absolute',
    bottom: 20,
    left: 0,
    right: 0,
    fontSize: 10,
    textAlign: 'center',
    color: 'grey',
  },
  logo: {
    width: 120,
    marginBottom: 20,
    alignSelf: 'center',
  }
});

// Create PDF Document
const ApplicationPDF = ({ applicant, education, employment, references, verification, equal, discipline }) => (
  <Document>
    <Page size="A4" style={styles.page}>
      <Text style={styles.title}>Swiis Application</Text>
      
      {/* Personal Information */}
      <Text style={styles.subtitle}>Personal Information</Text>
      <View style={styles.fullSection}>
        <View style={styles.row}>
          <View style={styles.col33}>
            <Text style={styles.label}>Full Name:</Text>
            <Text style={styles.value}>{applicant.title} {applicant.firstName} {applicant.middleName || ''} {applicant.lastName}</Text>
          </View>
          <View style={styles.col33}>
            <Text style={styles.label}>Email:</Text>
            <Text style={styles.value}>{applicant.email}</Text>
          </View>
          <View style={styles.col33}>
            <Text style={styles.label}>Phone:</Text>
            <Text style={styles.value}>{applicant.mobilePhone}</Text>
          </View>
        </View>
        
        <View style={styles.row}>
          <View style={styles.col66}>
            <Text style={styles.label}>Address:</Text>
            <Text style={styles.value}>{applicant.address}</Text>
          </View>
          <View style={styles.col33}>
            <Text style={styles.label}>Postcode:</Text>
            <Text style={styles.value}>{applicant.postcode}</Text>
          </View>
        </View>
        
        <View style={styles.row}>
          <View style={styles.col50}>
            <Text style={styles.label}>Position Applied For:</Text>
            <Text style={styles.value}>{applicant.positionAppliedFor || 'Not specified'}</Text>
          </View>
          <View style={styles.col50}>
            <Text style={styles.label}>Nationality:</Text>
            <Text style={styles.value}>{applicant.nationality}</Text>
          </View>
        </View>
        
        <View style={styles.row}>
          <View style={styles.col33}>
            <Text style={styles.label}>Right to Work:</Text>
            <Text style={styles.value}>{applicant.rightToWork ? 'Yes' : 'No'}</Text>
          </View>
          <View style={styles.col33}>
            <Text style={styles.label}>Driving License:</Text>
            <Text style={styles.value}>{applicant.drivingLicence ? 'Yes' : 'No'}</Text>
          </View>
        </View>
      </View>
      
      {/* Education */}
      <Text style={styles.subtitle}>Education History</Text>
      <View style={styles.fullSection}>
        {education && education.length > 0 ? (
          education.map((entry, index) => (
            <View key={index} style={styles.section}>
              <View style={styles.row}>
                <View style={styles.col66}>
                  <Text style={styles.label}>Institution:</Text>
                  <Text style={styles.value}>{entry.institution}</Text>
                </View>
                <View style={styles.col33}>
                  <Text style={styles.label}>Years:</Text>
                  <Text style={styles.value}>
                    {new Date(entry.startDate).getFullYear()} - 
                    {entry.endDate ? new Date(entry.endDate).getFullYear() : 'Present'}
                  </Text>
                </View>
              </View>
              <View style={styles.row}>
                <View style={styles.col33}>
                  <Text style={styles.label}>Qualification:</Text>
                  <Text style={styles.value}>{entry.qualification}</Text>
                </View>
                <View style={styles.col33}>
                  <Text style={styles.label}>Grade:</Text>
                  <Text style={styles.value}>{entry.grade || 'N/A'}</Text>
                </View>
                <View style={styles.col33}>
                  <Text style={styles.label}>Field of Study:</Text>
                  <Text style={styles.value}>{entry.fieldOfStudy || 'N/A'}</Text>
                </View>
              </View>
              {index < education.length - 1 && <View style={{ borderBottom: '1px solid #eee', marginVertical: 10 }} />}
            </View>
          ))
        ) : (
          <Text style={styles.value}>No education history provided</Text>
        )}
      </View>
    </Page>
    
    {/* Employment History */}
    <Page size="A4" style={styles.page}>
      <Text style={styles.header}>Swiis Application - Employment History</Text>
      <Text style={styles.subtitle}>Employment History</Text>
      <View style={styles.fullSection}>
        {employment && employment.length > 0 ? (
          employment.map((job, index) => (
            <View key={index} style={styles.employmentEntry}>
              <View style={styles.row}>
                <View style={styles.col50}>
                  <Text style={styles.label}>Employer:</Text>
                  <Text style={styles.value}>{job.employer}</Text>
                </View>
                <View style={styles.col50}>
                  <Text style={styles.label}>Position:</Text>
                  <Text style={styles.value}>{job.position}</Text>
                </View>
              </View>
              
              <View style={styles.row}>
                <View style={styles.col50}>
                  <Text style={styles.label}>Address:</Text>
                  <Text style={styles.value}>{job.employerAddress}</Text>
                </View>
                <View style={styles.col50}>
                  <Text style={styles.label}>Postcode:</Text>
                  <Text style={styles.value}>{job.employerPostcode || 'Not provided'}</Text>
                </View>
              </View>
              
              <View style={styles.row}>
                <View style={styles.col50}>
                  <Text style={styles.label}>Phone (Work):</Text>
                  <Text style={styles.value}>{job.employerPhone}</Text>
                </View>
                <View style={styles.col50}>
                  <Text style={styles.label}>Mobile:</Text>
                  <Text style={styles.value}>{job.employerMobile || 'Not provided'}</Text>
                </View>
              </View>
              
              <View style={styles.row}>
                <View style={styles.col33}>
                  <Text style={styles.label}>Start Date:</Text>
                  <Text style={styles.value}>{new Date(job.startDate).toLocaleDateString()}</Text>
                </View>
                <View style={styles.col33}>
                  <Text style={styles.label}>End Date:</Text>
                  <Text style={styles.value}>
                    {job.endDate ? new Date(job.endDate).toLocaleDateString() : 'Present'}
                  </Text>
                </View>
                <View style={styles.col33}>
                  <Text style={styles.label}>Reason for Leaving:</Text>
                  <Text style={styles.value}>{job.reasonForLeaving || 'N/A'}</Text>
                </View>
              </View>
              
              <View style={styles.row}>
                <View style={styles.col50}>
                  <Text style={styles.label}>Main Duties:</Text>
                  <Text style={styles.value}>{job.mainDuties}</Text>
                </View>
                <View style={styles.col50}>
                  <Text style={styles.label}>Worked with Children/Vulnerable Adults:</Text>
                  <Text style={styles.value}>{job.involvedWithVulnerable ? 'Yes' : 'No'}</Text>
                </View>
              </View>
            </View>
          ))
        ) : (
          <Text style={styles.value}>No employment history provided</Text>
        )}
      </View>
      
      {/* Skills & Experience */}
      <Text style={styles.subtitle}>Skills & Experience</Text>
      <View style={styles.fullSection}>
        <Text style={styles.value}>
          {applicant.skillsAndExperience || 'No skills and experience details provided'}
        </Text>
      </View>
      
      <Text style={styles.pageNumber}>Page 2</Text>
    </Page>
    
    {/* References */}
    <Page size="A4" style={styles.page}>
      <Text style={styles.header}>Swiis Application - References & Checks</Text>
      <Text style={styles.subtitle}>References</Text>
      <View style={styles.fullSection}>
        {references && references.length > 0 ? (
          references.map((ref, index) => (
            <View key={index} style={styles.reference}>
              <View style={styles.row}>
                <View style={styles.col50}>
                  <Text style={styles.label}>Referee Name:</Text>
                  <Text style={styles.value}>{ref.refereeName}</Text>
                </View>
                <View style={styles.col50}>
                  <Text style={styles.label}>Relationship:</Text>
                  <Text style={styles.value}>{ref.relationship}</Text>
                </View>
              </View>
              
              <View style={styles.row}>
                <View style={styles.col50}>
                  <Text style={styles.label}>Email:</Text>
                  <Text style={styles.value}>{ref.refereeEmail}</Text>
                </View>
                <View style={styles.col50}>
                  <Text style={styles.label}>Phone:</Text>
                  <Text style={styles.value}>{ref.refereePhone}</Text>
                </View>
              </View>
              
              <View style={styles.row}>
                <View style={styles.col66}>
                  <Text style={styles.label}>Company:</Text>
                  <Text style={styles.value}>{ref.company || 'N/A'}</Text>
                </View>
                <View style={styles.col33}>
                  <Text style={styles.label}>Position:</Text>
                  <Text style={styles.value}>{ref.position || 'N/A'}</Text>
                </View>
              </View>
              
              <View style={styles.row}>
                <View style={styles.col50}>
                  <Text style={styles.label}>Permission to Contact:</Text>
                  <Text style={styles.value}>{ref.permissionToContact ? 'Yes' : 'No'}</Text>
                </View>
                <View style={styles.col50}>
                  <Text style={styles.label}>Reference Verified:</Text>
                  <Text style={styles.value}>{ref.referenceVerified ? 'Yes' : 'No'}</Text>
                </View>
              </View>
            </View>
          ))
        ) : (
          <Text style={styles.value}>No references provided</Text>
        )}
      </View>
      
      {/* Disciplinary & Criminal */}
      <Text style={styles.subtitle}>Disciplinary & Criminal Record</Text>
      <View style={styles.fullSection}>
        {discipline ? (
          <View>
            <View style={styles.row}>
              <View style={styles.col50}>
                <Text style={styles.label}>Ever been subject to disciplinary proceedings?</Text>
                <Text style={styles.value}>{discipline.hasDisciplinary ? 'Yes' : 'No'}</Text>
              </View>
              <View style={styles.col50}>
                <Text style={styles.label}>Ever been dismissed?</Text>
                <Text style={styles.value}>{discipline.hasBeenDismissed ? 'Yes' : 'No'}</Text>
              </View>
            </View>
            
            <View style={styles.row}>
              <View style={styles.col50}>
                <Text style={styles.label}>Ever been convicted of an offense?</Text>
                <Text style={styles.value}>{discipline.hasConvictions ? 'Yes' : 'No'}</Text>
              </View>
              <View style={styles.col50}>
                <Text style={styles.label}>Ever been investigated by authorities?</Text>
                <Text style={styles.value}>{discipline.hasBeenInvestigated ? 'Yes' : 'No'}</Text>
              </View>
            </View>
            
            {discipline.explanationText && (
              <View>
                <Text style={styles.label}>Explanation:</Text>
                <Text style={styles.value}>{discipline.explanationText}</Text>
              </View>
            )}
          </View>
        ) : (
          <Text style={styles.value}>No disciplinary information provided</Text>
        )}
      </View>
      
      <Text style={styles.pageNumber}>Page 3</Text>
    </Page>
    
    {/* Verification Checks */}
    <Page size="A4" style={styles.page}>
      <Text style={styles.header}>Swiis Application - Verification</Text>
      <Text style={styles.subtitle}>Verification Checks</Text>
      <View style={styles.fullSection}>
        {verification ? (
          <View>
            <View style={styles.row}>
              <View style={styles.col50}>
                <Text style={styles.label}>DBS Check Consented:</Text>
                <Text style={styles.value}>{verification.dbsCheckConsent ? 'Yes' : 'No'}</Text>
              </View>
              <View style={styles.col50}>
                <Text style={styles.label}>Right to Work Verification:</Text>
                <Text style={styles.value}>{verification.rightToWorkVerified ? 'Yes' : 'No'}</Text>
              </View>
            </View>
            
            <View style={styles.row}>
              <View style={styles.col50}>
                <Text style={styles.label}>Identity Verified:</Text>
                <Text style={styles.value}>{verification.identityVerified ? 'Yes' : 'No'}</Text>
              </View>
              <View style={styles.col50}>
                <Text style={styles.label}>Qualifications Verified:</Text>
                <Text style={styles.value}>{verification.qualificationsVerified ? 'Yes' : 'No'}</Text>
              </View>
            </View>
            
            {verification.additionalNotes && (
              <View>
                <Text style={styles.label}>Additional Notes:</Text>
                <Text style={styles.value}>{verification.additionalNotes}</Text>
              </View>
            )}
          </View>
        ) : (
          <Text style={styles.value}>No verification information provided</Text>
        )}
      </View>
      
      {/* Equal Opportunities section has been removed as requested */}
      
      {/* Certification */}
      <Text style={styles.subtitle}>Declaration</Text>
      <View style={styles.fullSection}>
        <Text style={styles.value}>
          I declare that the information I have given on this form is correct and complete to the best of my knowledge and belief.
          I understand that any false statement or omission may lead to my application being rejected
          or, if I am appointed, to dismissal or potential prosecution.
        </Text>
        
        <View style={{ marginTop: 20 }}>
          <View style={styles.row}>
            <View style={styles.col50}>
              <Text style={styles.label}>Applicant Name:</Text>
              <Text style={styles.value}>{applicant.firstName} {applicant.lastName}</Text>
            </View>
            <View style={styles.col50}>
              <Text style={styles.label}>Date Submitted:</Text>
              <Text style={styles.value}>{applicant.completedAt ? new Date(applicant.completedAt).toLocaleDateString() : new Date().toLocaleDateString()}</Text>
            </View>
          </View>
        </View>
      </View>
      
      <Text style={styles.footer}>Swiis Application Form - Confidential</Text>
      <Text style={styles.pageNumber}>Page 4</Text>
    </Page>
  </Document>
);

// Export PDF Download Component
export const ApplicationPDFDownload = ({ applicant, education, employment, references, verification, equal, discipline }) => {
  // Make sure we have all the necessary data and handle null/undefined values
  // Log detailed information about what data is available for the PDF
  console.log("PDF Data Details:", { 
    applicant: applicant ? Object.keys(applicant).length + " fields" : "missing",
    education: Array.isArray(education) ? education.length + " entries" : "missing",
    employment: Array.isArray(employment) ? employment.length + " entries" : "missing",
    references: Array.isArray(references) ? references.length + " entries" : "missing",
    verification: verification ? "available" : "missing"
  });
  
  // Create safe objects with fallbacks for all data
  const safeApplicant = applicant || {};
  const safeEducation = Array.isArray(education) ? education : [];
  const safeEmployment = Array.isArray(employment) ? employment : [];
  const safeReferences = Array.isArray(references) ? references : [];
  const safeVerification = verification || {};
  const safeEqual = equal || {};
  const safeDiscipline = discipline || {};
  return (
    <PDFDownloadLink
      document={
        <ApplicationPDF 
          applicant={safeApplicant} 
          education={safeEducation} 
          employment={safeEmployment}
          references={safeReferences}
          verification={safeVerification}
          equal={safeEqual}
          discipline={safeDiscipline}
        />
      }
      fileName={`Swiis_Application_${safeApplicant.firstName || 'Form'}_${safeApplicant.lastName || ''}.pdf`}
    >
      {({ blob, url, loading, error }) => (
        <Button 
          variant="outline" 
          className="flex items-center gap-2" 
          disabled={loading}
        >
          <FileDown className="h-4 w-4" />
          {loading ? 'Generating PDF...' : 'Download Application PDF'}
        </Button>
      )}
    </PDFDownloadLink>
  );
};