import React from "react";
import { Page, Text, Image, View, Document, StyleSheet, Font } from '@react-pdf/renderer';
import CertificateImage from  "../../images/Certificate.png" 

Font.register({
  family: 'Open Sans',
  fonts: [
    { src: 'https://cdn.jsdelivr.net/npm/open-sans-all@0.1.3/fonts/open-sans-regular.ttf' },
    { src: 'https://cdn.jsdelivr.net/npm/open-sans-all@0.1.3/fonts/open-sans-600.ttf', fontWeight: 600 }
  ]
});

const styles = StyleSheet.create({
    page: {
      backgroundColor: "#f7f7f7",
    },
    certificate: {
      marginTop: 5
    },
    trainee: {
      marginTop: -960
    },
    course: {
      marginTop: 270
    },
    text: {
      fontFamily: "Open Sans",
      fontSize: 110,
      fontWeight: 600,
      textAlign: "center",
      textOverflow: "ellipsis",
      maxWidth: 3000,
      marginLeft: 200
    }
  });

function Certificate(props) {
  return (
      <Document>
        <Page size={[1920,3400]} orientation="landscape" style={styles.page}>
          <View style={styles.certificate}>
              <Image src={CertificateImage}>{"Header"}</Image>
          </View>
          <View style={styles.trainee}>
              <Text style={styles.text}>{props.Name}</Text>
          </View>
          <View style={styles.course}>
              <Text style={styles.text}>{props.Course}</Text>
          </View>
        </Page>
      </Document>
    )
}

export default Certificate;