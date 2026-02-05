import Map "mo:core/Map";
import Text "mo:core/Text";
import Runtime "mo:core/Runtime";
import Principal "mo:core/Principal";
import Array "mo:core/Array";
import MixinAuthorization "authorization/MixinAuthorization";
import AccessControl "authorization/access-control";
import MixinStorage "blob-storage/Mixin";

actor {
  // Initialize the access control state
  let accessControlState = AccessControl.initState();
  include MixinAuthorization(accessControlState);

  include MixinStorage();

  public type ResumeData = {
    id : Text;
    content : Text;
    user : Principal;
    title : Text;
  };

  public type UserProfile = {
    name : Text;
  };

  let resumes = Map.empty<Text, ResumeData>();
  let userProfiles = Map.empty<Principal, UserProfile>();

  // Helper function to ensure authenticated users have user role
  private func ensureUserRole(caller : Principal) {
    // Skip anonymous principal
    if (caller.isAnonymous()) {
      return;
    };

    // Check if user already has a role (user or admin)
    let currentRole = AccessControl.getUserRole(accessControlState, caller);
    
    // If they're a guest and authenticated, promote them to user
    switch (currentRole) {
      case (#guest) {
        // Auto-assign user role to authenticated principals
        // Note: This uses a system-level assignment, not requiring admin check
        // The first caller becomes admin via initialize(), others become users
        AccessControl.assignRole(accessControlState, caller, caller, #user);
      };
      case (#user or #admin) {
        // Already has appropriate role
      };
    };
  };

  // User Profile Management Functions
  public query ({ caller }) func getCallerUserProfile() : async ?UserProfile {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can access profiles");
    };
    userProfiles.get(caller);
  };

  public query ({ caller }) func getUserProfile(user : Principal) : async ?UserProfile {
    if (caller != user and not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized: Can only view your own profile");
    };
    userProfiles.get(user);
  };

  public shared ({ caller }) func saveCallerUserProfile(profile : UserProfile) : async () {
    ensureUserRole(caller);
    
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can save profiles");
    };
    userProfiles.add(caller, profile);
  };

  // Resume Management Functions
  public shared ({ caller }) func createResume(resumeId : Text, title : Text, content : Text) : async () {
    ensureUserRole(caller);
    
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can create resumes");
    };

    if (resumes.containsKey(resumeId)) {
      Runtime.trap("Resume with this ID already exists. Choose a different ID.");
    };

    let resume : ResumeData = {
      id = resumeId;
      title;
      user = caller;
      content;
    };

    resumes.add(resumeId, resume);
  };

  public shared ({ caller }) func updateResume(resumeId : Text, newContent : Text, newTitle : Text) : async () {
    ensureUserRole(caller);
    
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can update resumes");
    };

    switch (resumes.get(resumeId)) {
      case (null) {
        Runtime.trap("Resume not found");
      };
      case (?resume) {
        if (resume.user != caller and not AccessControl.isAdmin(accessControlState, caller)) {
          Runtime.trap("Unauthorized: Only the owner can update this resume.");
        };

        let updatedResume : ResumeData = {
          resume with
          content = newContent;
          title = newTitle;
        };
        resumes.add(resumeId, updatedResume);
      };
    };
  };

  public query ({ caller }) func getResume(resumeId : Text) : async ResumeData {
    switch (resumes.get(resumeId)) {
      case (null) {
        Runtime.trap("Resume not found");
      };
      case (?resume) {
        // Only the owner or admin can read the resume
        if (resume.user != caller and not AccessControl.isAdmin(accessControlState, caller)) {
          Runtime.trap("Unauthorized: Only the owner can view this resume.");
        };
        resume;
      };
    };
  };

  public shared ({ caller }) func duplicateResume(originalResumeId : Text, newResumeId : Text) : async () {
    ensureUserRole(caller);
    
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can duplicate resumes");
    };

    if (resumes.containsKey(newResumeId)) {
      Runtime.trap("Resume with the new ID already exists. Choose a different ID.");
    };

    switch (resumes.get(originalResumeId)) {
      case (null) {
        Runtime.trap("Resume not found");
      };
      case (?resume) {
        if (resume.user != caller and not AccessControl.isAdmin(accessControlState, caller)) {
          Runtime.trap("Unauthorized: Only the owner can duplicate this resume.");
        };

        let duplicatedResume : ResumeData = {
          resume with id = newResumeId;
        };
        resumes.add(newResumeId, duplicatedResume);
      };
    };
  };

  public shared ({ caller }) func renameResume(resumeId : Text, newTitle : Text) : async () {
    ensureUserRole(caller);
    
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can rename resumes");
    };

    switch (resumes.get(resumeId)) {
      case (null) {
        Runtime.trap("Resume not found");
      };
      case (?resume) {
        if (resume.user != caller and not AccessControl.isAdmin(accessControlState, caller)) {
          Runtime.trap("Unauthorized: Only the owner can rename this resume.");
        };

        let renamedResume : ResumeData = {
          resume with title = newTitle;
        };
        resumes.add(resumeId, renamedResume);
      };
    };
  };

  public shared ({ caller }) func deleteResume(resumeId : Text) : async () {
    ensureUserRole(caller);
    
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can delete resumes");
    };

    switch (resumes.get(resumeId)) {
      case (null) {
        Runtime.trap("Resume not found");
      };
      case (?resume) {
        if (resume.user != caller and not AccessControl.isAdmin(accessControlState, caller)) {
          Runtime.trap("Unauthorized: Only the owner can delete this resume.");
        };
        resumes.remove(resumeId);
      };
    };
  };

  public query ({ caller }) func getAllResumesForUser(user : Principal) : async [ResumeData] {
    // Users can only fetch their own resumes, admins can fetch any user's resumes
    if (caller != user and not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized: Can only view your own resumes");
    };

    resumes.values().toArray().filter(
      func(resume) {
        resume.user == user;
      }
    );
  };
};
