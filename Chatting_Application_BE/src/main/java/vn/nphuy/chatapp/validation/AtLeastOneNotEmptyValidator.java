package vn.nphuy.chatapp.validation;

import org.springframework.beans.BeanWrapperImpl;

import jakarta.validation.ConstraintValidator;
import jakarta.validation.ConstraintValidatorContext;
import vn.nphuy.chatapp.util.annotation.AtLeastOneNotEmpty;

public class AtLeastOneNotEmptyValidator implements ConstraintValidator<AtLeastOneNotEmpty, Object> {
  private String[] fields;

  @Override
  public void initialize(AtLeastOneNotEmpty constraintAnnotation) {
    this.fields = constraintAnnotation.fields();
  }

  @Override
  public boolean isValid(Object object, ConstraintValidatorContext context) {
    if (object == null) {
      return true;
    }

    boolean hasValue = false;
    BeanWrapperImpl beanWrapper = new BeanWrapperImpl(object);

    for (String field : fields) {
      Object fieldValue = beanWrapper.getPropertyValue(field);
      if (fieldValue != null && String.class.isAssignableFrom(fieldValue.getClass())) {
        String stringValue = (String) fieldValue;
        if (!stringValue.trim().isEmpty()) {
          hasValue = true;
          break;
        }
      }
    }

    if (!hasValue) {
      context.disableDefaultConstraintViolation();
      context.buildConstraintViolationWithTemplate(context.getDefaultConstraintMessageTemplate())
          .addConstraintViolation();
    }

    return hasValue;
  }
}