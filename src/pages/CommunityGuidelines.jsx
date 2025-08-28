import { FadeIn, SlideIn } from "../components/AnimatedComponents";
import { Shield, Users, Heart, AlertTriangle, CheckCircle, XCircle } from "lucide-react";

const CommunityGuidelines = () => {
  const guidelines = [
    {
      icon: Shield,
      title: "Respect & Kindness",
      description: "Treat everyone with respect. No bullying, harassment, or hate speech.",
      examples: ["Be kind to others", "Respect different opinions", "No personal attacks"],
      notAllowed: ["Bullying", "Name-calling", "Threats"]
    },
    {
      icon: Users,
      title: "Appropriate Content",
      description: "Keep content family-friendly and suitable for all ages.",
      examples: ["School discussions", "Positive messages", "Constructive feedback"],
      notAllowed: ["Profanity", "Violence", "Adult content", "Drug references"]
    },
    {
      icon: Heart,
      title: "Positive Environment",
      description: "Create a supportive space for everyone in the school community.",
      examples: ["Encourage others", "Share positive experiences", "Help classmates"],
      notAllowed: ["Negative gossip", "Spreading rumors", "Creating drama"]
    },
    {
      icon: AlertTriangle,
      title: "No Harmful Content",
      description: "Never post content that could harm yourself or others.",
      examples: ["Seek help if needed", "Report concerning posts", "Support struggling peers"],
      notAllowed: ["Self-harm content", "Violence", "Dangerous challenges"]
    }
  ];

  const consequences = [
    {
      level: "Warning",
      icon: AlertTriangle,
      color: "text-yellow-600",
      bgColor: "bg-yellow-50",
      description: "First violation - content removed with warning"
    },
    {
      level: "Temporary Ban",
      icon: XCircle,
      color: "text-orange-600",
      bgColor: "bg-orange-50",
      description: "Repeated violations - 24-48 hour suspension"
    },
    {
      level: "Permanent Ban",
      icon: XCircle,
      color: "text-red-600",
      bgColor: "bg-red-50",
      description: "Severe or repeated violations - permanent removal"
    }
  ];

  return (
    <div className="w-full max-w-4xl mx-auto px-4 md:px-6 py-8">
      {/* Header */}
      <FadeIn delay={0.2} className="text-center mb-12">
        <div className="mb-6">
          <Shield className="w-16 h-16 md:w-20 md:h-20 mx-auto text-blue-600" />
        </div>
        <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4 font-['Comic_Sans_MS']">
          Community Guidelines
        </h1>
        <p className="text-lg text-gray-600 max-w-2xl mx-auto font-['Comic_Sans_MS']">
          Help us maintain a safe, respectful, and positive environment for everyone.
          These guidelines ensure our Freedom Wall remains a place where students can
          express themselves freely while respecting others.
        </p>
      </FadeIn>

      {/* Guidelines */}
      <div className="space-y-8 mb-12">
        {guidelines.map((guideline, index) => (
          <SlideIn key={index} direction="up" delay={0.3 + index * 0.1}>
            <div className="bg-white rounded-xl shadow-lg p-6 md:p-8 border border-gray-100">
              <div className="flex items-start gap-4">
                <div className="flex-shrink-0">
                  <guideline.icon className="w-8 h-8 text-blue-600" />
                </div>
                <div className="flex-1">
                  <h3 className="text-xl font-bold text-gray-900 mb-3 font-['Comic_Sans_MS']">
                    {guideline.title}
                  </h3>
                  <p className="text-gray-600 mb-4 font-['Comic_Sans_MS']">
                    {guideline.description}
                  </p>
                  
                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <h4 className="font-semibold text-green-700 mb-2 flex items-center gap-2 font-['Comic_Sans_MS']">
                        <CheckCircle className="w-4 h-4" />
                        Examples
                      </h4>
                      <ul className="space-y-1">
                        {guideline.examples.map((example, i) => (
                          <li key={i} className="text-sm text-gray-600 flex items-center gap-2 font-['Comic_Sans_MS']">
                            <div className="w-1.5 h-1.5 bg-green-500 rounded-full"></div>
                            {example}
                          </li>
                        ))}
                      </ul>
                    </div>
                    
                    <div>
                      <h4 className="font-semibold text-red-700 mb-2 flex items-center gap-2 font-['Comic_Sans_MS']">
                        <XCircle className="w-4 h-4" />
                        Not Allowed
                      </h4>
                      <ul className="space-y-1">
                        {guideline.notAllowed.map((item, i) => (
                          <li key={i} className="text-sm text-gray-600 flex items-center gap-2 font-['Comic_Sans_MS']">
                            <div className="w-1.5 h-1.5 bg-red-500 rounded-full"></div>
                            {item}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </SlideIn>
        ))}
      </div>

      {/* Consequences */}
      <FadeIn delay={0.6} className="mb-12">
        <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl p-6 md:p-8 border border-blue-200">
          <h2 className="text-2xl font-bold text-gray-900 mb-6 text-center font-['Comic_Sans_MS']">
            Consequences for Violations
          </h2>
          <div className="grid md:grid-cols-3 gap-4">
            {consequences.map((consequence, index) => (
              <div key={index} className={`${consequence.bgColor} rounded-lg p-4 text-center`}>
                <consequence.icon className={`w-8 h-8 mx-auto mb-3 ${consequence.color}`} />
                <h3 className={`font-bold mb-2 ${consequence.color} font-['Comic_Sans_MS']`}>
                  {consequence.level}
                </h3>
                <p className="text-sm text-gray-700 font-['Comic_Sans_MS']">
                  {consequence.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </FadeIn>

      {/* Reporting Section */}
      <FadeIn delay={0.8} className="bg-white rounded-xl shadow-lg p-6 md:p-8 border border-gray-100">
        <h2 className="text-2xl font-bold text-gray-900 mb-4 text-center font-['Comic_Sans_MS']">
          How to Report Violations
        </h2>
        <div className="grid md:grid-cols-2 gap-6">
          <div>
            <h3 className="font-semibold text-gray-900 mb-3 font-['Comic_Sans_MS']">
              Report Button
            </h3>
            <p className="text-gray-600 mb-4 font-['Comic_Sans_MS']">
              Use the report button (🚩) on any post or comment that violates these guidelines.
              Your report helps us maintain a safe environment.
            </p>
            <div className="bg-gray-50 rounded-lg p-3 text-center">
              <p className="text-sm text-gray-600 font-['Comic_Sans_MS']">
                🚩 Report inappropriate content
              </p>
            </div>
          </div>
          
          <div>
            <h3 className="font-semibold text-gray-900 mb-3 font-['Comic_Sans_MS']">
              What Happens Next
            </h3>
            <ol className="list-decimal list-inside space-y-2 text-gray-600 font-['Comic_Sans_MS']">
              <li>We review your report within 24 hours</li>
              <li>Content is evaluated against our guidelines</li>
              <li>Appropriate action is taken if needed</li>
              <li>You'll be notified of the outcome</li>
            </ol>
          </div>
        </div>
      </FadeIn>

      {/* Footer */}
      <FadeIn delay={1.0} className="text-center mt-12">
        <div className="bg-gray-50 rounded-xl p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-3 font-['Comic_Sans_MS']">
            Questions or Concerns?
          </h3>
          <p className="text-gray-600 mb-4 font-['Comic_Sans_MS']">
            If you have questions about these guidelines or need to report a serious issue,
            please contact us through the Contact page.
          </p>
          <a
            href="/contact"
            className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg transition-colors font-['Comic_Sans_MS'] font-medium"
          >
            Contact Us
          </a>
        </div>
      </FadeIn>
    </div>
  );
};

export default CommunityGuidelines;
