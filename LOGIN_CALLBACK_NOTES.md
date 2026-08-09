# Angel Live login callback fix

This build keeps the production Angel Live website and adds Capacitor App/Browser support plus
Android deep-link intent filters for:
- https://app.angellive.soulverseapps.com
- angellive://oauth

Important: the web authentication provider must redirect to one of these callback URLs for
native return-to-app to occur. If the live site's Firebase/Google OAuth configuration currently
uses a different callback host, that callback URL must also be registered in the auth provider.
The APK-side configuration is prepared for the production domain and custom Angel Live scheme.
