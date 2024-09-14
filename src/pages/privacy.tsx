import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const PrivacyPolicy: React.FC = () => {
  return (
    <Card className="max-w-3xl mx-auto mt-10">
      <CardHeader>
        <CardTitle>Privacy Policy</CardTitle>
      </CardHeader>
      <CardContent>
        <ul className="list-disc pl-5 space-y-2">
          <li>
            <p>
              <strong>With your consent.</strong>
              We may share data with third parties after obtaining your consent.
            </p>
          </li>
          <li>
            <p>
              <strong>With advertising and analytics partners.</strong>
              Please refer to the section titled "Advertising and Analytics"
              below.
            </p>
          </li>
        </ul>

        <h3 className="text-xl font-semibold mt-6 mb-2">Data Security</h3>
        <p>
          We implement commercially reasonable security measures to protect your
          information. However, despite our best efforts, no security measures
          are completely impenetrable.
        </p>

        <h3 className="text-xl font-semibold mt-6 mb-2">Data Retention</h3>
        <p>
          We store the information we collect about you for as long as necessary
          to achieve the purposes of collection, including to fulfill our legal,
          regulatory, or other compliance obligations.
        </p>

        <h3 className="text-xl font-semibold mt-6 mb-2">Age Restriction</h3>
        <p>
          Our services are intended for adults 18 years and older. We do not
          knowingly collect personal information from children. If you are a
          parent or legal guardian and believe your child under 13 has provided
          us with information, please contact us at the address listed at the
          end of this privacy policy by email or letter. Please include "COPPA
          Information Request" in your query.
        </p>

        <h3 className="text-xl font-semibold mt-6 mb-2">
          Changes to this Privacy Policy
        </h3>
        <p>
          Guy Chien may update this Privacy Policy from time to time. We
          encourage you to review this page regularly to stay informed. If
          changes are significant, we may provide additional notice via email or
          through our services. Your continued use of the service indicates your
          acceptance of the modified privacy policy.
        </p>

        <h3 className="text-xl font-semibold mt-6 mb-2">
          Information Stored in the United States
        </h3>
        <p>
          We maintain information that may be stored in the United States and
          other countries. If you reside outside the United States, you
          understand and agree that we may transfer your information to the
          United States, and the laws of the United States may not provide the
          same level of protection as those in your country.
        </p>

        <h3 className="text-xl font-semibold mt-6 mb-2">Contact Us</h3>
        <p>
          If you have any questions, comments, or concerns about this Privacy
          Policy, you can contact us at:
        </p>
        <ul className="list-disc pl-5 space-y-2">
          <li>
            <p>265, Sec. 2, Neihu Rd., Neihu Dist., Taipei City 114, Taiwan</p>
          </li>
          <li>
            <p>https://pr.guychienll.dev</p>
          </li>
          <li>
            <p>guychienll@gmail.com</p>
          </li>
          <li>
            <p>(+886) 986503689</p>
          </li>
        </ul>
      </CardContent>
    </Card>
  );
};

export default PrivacyPolicy;
